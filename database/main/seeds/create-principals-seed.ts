import { Seed } from '@riao/dbal/seed';
import { Principal } from '@/auth/principals';
import { authService, UserPrincipal } from '@/auth';

const seeds: Omit<Principal, 'id' | 'principal_id' | 'create_timestamp'>[] = [
	{
		login: 'john.doe@example.com',
		name: 'John Doe',
	},
	{
		login: 'jane.smith@example.com',
		name: 'Jane Smith',
	},
	{
		login: 'drew@stateless.studio',
		name: 'Drew Immerman',
	},
];

async function createPrincipal(
	principal: Omit<UserPrincipal, 'id' | 'create_timestamp'>
): Promise<string> {
	const id = await authService.createPrincipal(principal);

	return id as string;
}

export default class CreatePrincipalsSeed extends Seed {
	override async up(): Promise<void> {
		for (const seed of seeds) {
			await createPrincipal({
				login: seed.login,
				name: seed.name,
				type: 'user',
				password: 'password123',
			});
		}
	}

	override async down(): Promise<void> {}
}
