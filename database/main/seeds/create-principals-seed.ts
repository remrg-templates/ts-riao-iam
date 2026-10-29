import { Seed } from '@riao/dbal/seed';
import { PasswordAuthentication } from '@riao/authn-password';
import { Principal } from '@riao/iam/auth';
import { RbacAuthorization } from '@riao/authz-rbac';

interface UserPrincipal extends Principal {
	login: string;
	password: string;
}

class UserAuthentication extends PasswordAuthentication<UserPrincipal> {}

const seeds: Omit<Principal, 'id' | 'principal_id' | 'create_timestamp'>[] = [
	{
		login: 'john.doe@example.com',
		name: 'John Doe',
		type: 'user',
	},
	{
		login: 'jane.smith@example.com',
		name: 'Jane Smith',
		type: 'user',
	},
	{
		login: 'drew@stateless.studio',
		name: 'Drew Immerman',
		type: 'user',
	},
];

export default class CreatePrincipalsSeed extends Seed {
	override async up(): Promise<void> {
		const authorization = new RbacAuthorization({ db: this.db });
		const authService = new UserAuthentication({ db: this.db });
		const administratorRole = await authorization.rolesRepo.findOne({
			where: { name: 'administrator' },
		});
		if (!administratorRole) {
			throw new Error(
				'Administrator role is missing; run the authorization roles seed first'
			);
		}

		for (const [index, seed] of seeds.entries()) {
			const principalId = await authService.createPrincipal({
				login: seed.login,
				name: seed.name,
				type: seed.type,
				password: 'password123',
			});

			if (index === 0) {
				await authorization.assignRole({
					principalId,
					roleId: administratorRole.id,
				});
			}
		}
	}

	override async down(): Promise<void> {}
}
