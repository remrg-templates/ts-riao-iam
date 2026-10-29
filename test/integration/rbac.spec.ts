import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RbacAuthorization } from '@riao/authz-rbac';
import { Principal } from '@riao/iam/auth';
import { maindb } from '../../database/main';
import RoleSeed from '../../database/main/seeds/create-authorization-roles';
import CreatePrincipalsSeed from '../../database/main/seeds/create-principals-seed';
import { Server } from '@/api/server';
import { jwtManager } from '@/auth/auth.service';
import { testEnv } from '../test-env';

class TestServer extends Server {
	get url(): string {
		const address = this.listener.address();
		if (!address || typeof address === 'string') {
			throw new Error('Expected a TCP listener');
		}

		return `http://127.0.0.1:${address.port}`;
	}
}

describe('password authentication and RBAC integration', () => {
	const server = new TestServer(0);
	let adminToken: string;
	let userToken: string;
	let adminId: string;
	let authorization: RbacAuthorization;

	async function login(login: string): Promise<{ token: string; id: string }> {
		const response = await fetch(`${server.url}/api/v1/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password: 'password123' }),
		});
		expect(response.status).toBe(201);
		const body = await response.json();
		expect(body.token).toBeTypeOf('string');
		expect(body.user.id).toBeTypeOf('string');
		return { token: body.token, id: body.user.id };
	}

	beforeAll(async () => {
		maindb.configureFromEnv();
		await maindb.init({
			connectionOptions: {
				...maindb.env,
				database: testEnv.TEST_DB_NAME,
			},
		});
		authorization = new RbacAuthorization({ db: maindb });
		const roleSeed = new RoleSeed(maindb);
		await roleSeed.up();
		await roleSeed.up();
		await new CreatePrincipalsSeed(maindb).up();
		await server.start();
		const admin = await login('john.doe@example.com');
		adminToken = admin.token;
		adminId = admin.id;
		userToken = (await login('jane.smith@example.com')).token;
	});

	afterAll(async () => {
		await server.stop();
		try {
			if (maindb.isLoaded) {
				const principals = maindb.getQueryRepository<Principal>({
					table: 'iam_principals',
					identifiedBy: 'id',
				});
				for (const login of [
					'john.doe@example.com',
					'jane.smith@example.com',
					'drew@stateless.studio',
				]) {
					await principals.delete({ where: { login } });
				}
				await authorization.rolesRepo.delete({
					where: { name: 'administrator' },
				});
				for (const resource of ['principals', 'passwords', 'rbac']) {
					await authorization.permissionsRepo.delete({
						where: { action: 'manage', resource },
					});
				}
			}
		}
		finally {
			await maindb.disconnect();
		}
	});

	it('seeds roles, permissions, and user-role links separately', async () => {
		const roles = await authorization.rolesRepo.find({});
		expect(roles).toHaveLength(1);
		expect(roles[0].name).toBe('administrator');
		const permissions = await authorization.permissionsRepo.find({});
		expect(permissions).toHaveLength(3);
		expect(
			permissions.map(({ action, resource }) => ({ action, resource }))
		).toEqual(
			expect.arrayContaining(
				['principals', 'passwords', 'rbac'].map((resource) => ({
					action: 'manage',
					resource,
				}))
			)
		);

		expect(await authorization.rolePermissionsRepo.find({})).toHaveLength(3);
		const assignments = await authorization.principalRolesRepo.find({});
		expect(assignments).toHaveLength(1);
		expect(assignments[0]).toMatchObject({
			principal_id: adminId,
			role_id: roles[0].id,
		});
	});

	it('issues real JWTs without a hardcoded administrator role', async () => {
		const payload = await jwtManager.decodeToken(userToken);
		expect(payload['role']).toBeUndefined();
		expect(payload['userId']).toBeTypeOf('string');
	});

	it('keeps health checks public', async () => {
		expect((await fetch(`${server.url}/health`)).status).toBe(200);
	});

	it('distinguishes missing credentials, policy denials, and access', async () => {
		const path = `/api/v1/principals/${adminId}`;
		expect((await fetch(`${server.url}${path}`)).status).toBe(401);
		for (const [token, status] of [
			['invalid-token', 401],
			[userToken, 403],
			[adminToken, 200],
		] as const) {
			const response = await fetch(`${server.url}${path}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			expect(response.status).toBe(status);
		}
	});

	it('mounts RBAC without a generic repository registration', async () => {
		const path = '/api/v1/rbac/roles/roles';
		for (const [token, status] of [
			[userToken, 403],
			[adminToken, 200],
		] as const) {
			const response = await fetch(`${server.url}${path}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			expect(response.status).toBe(status);
		}
	});

	it('uses current role assignments rather than token claims', async () => {
		const assignments = await authorization.principalRolesRepo.find({
			where: { principal_id: adminId },
		});
		const assignment = assignments[0];

		try {
			await authorization.principalRolesRepo.update({
				where: { id: assignment.id },
				set: { deactivate_timestamp: new Date() },
			});

			const response = await fetch(
				`${server.url}/api/v1/principals/${adminId}`,
				{ headers: { Authorization: `Bearer ${adminToken}` } }
			);

			expect(response.status).toBe(403);
		}
		finally {
			await authorization.assignRole({
				roleId: assignment.role_id,
				principalId: adminId,
			});
		}
	});
});
