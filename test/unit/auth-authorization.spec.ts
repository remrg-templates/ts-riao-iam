import { afterEach, describe, expect, it, vi } from 'vitest';
import { authService, checkAccessToken, jwtManager } from '@/auth/auth.service';
import { UserPrincipal } from '@/auth';

describe('Bearer token authorization', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns the active principal ID from a valid token', async () => {
		const principal: UserPrincipal = {
			id: 'principal-id',
			type: 'user',
			login: 'user@example.com',
			name: 'Example User',
			create_timestamp: new Date(),
			password: '',
		};
		vi.spyOn(jwtManager, 'decodeToken').mockResolvedValue({
			userId: principal.id,
		});

		const findActivePrincipal = vi
			.spyOn(authService, 'findActivePrincipal')
			.mockResolvedValue(principal);

		await expect(checkAccessToken('valid-token')).resolves.toEqual({
			id: principal.id,
		});

		expect(findActivePrincipal).toHaveBeenCalledWith({
			where: { id: principal.id },
		});
	});

	it('rejects invalid JWTs and missing principal claims', async () => {
		await expect(checkAccessToken('invalid-token')).resolves.toBe(false);

		vi.spyOn(jwtManager, 'decodeToken').mockResolvedValue({});
		await expect(checkAccessToken('token-without-principal')).resolves.toBe(
			false
		);
	});

	it('rejects principals that are no longer active', async () => {
		vi.spyOn(jwtManager, 'decodeToken').mockResolvedValue({
			userId: 'inactive-principal',
		});
		vi.spyOn(authService, 'findActivePrincipal').mockResolvedValue(null);

		await expect(checkAccessToken('valid-token')).resolves.toBe(false);
	});

	it('propagates unexpected token verification failures', async () => {
		const error = new Error('JWT key is unavailable');
		vi.spyOn(jwtManager, 'decodeToken').mockRejectedValue(error);

		await expect(checkAccessToken('token')).rejects.toBe(error);
	});
});
