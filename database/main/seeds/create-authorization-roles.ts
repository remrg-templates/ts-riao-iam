import { Seed } from '@riao/dbal/seed';
import { RbacAuthorization } from '@riao/authz-rbac';

export default class CreateAuthorizationRoles extends Seed {
	override async up(): Promise<void> {
		const authorization = new RbacAuthorization({ db: this.db });
		const roleId = await authorization.role({
			name: 'administrator',
			description: 'Manage principals, passwords, and RBAC',
		});

		for (const resource of ['principals', 'passwords', 'rbac']) {
			const permissionId = await authorization.permission({
				action: 'manage',
				resource,
			});
			await authorization.addPermissionToRole({
				roleId,
				permissionId,
			});
		}
	}

	override async down(): Promise<void> {}
}
