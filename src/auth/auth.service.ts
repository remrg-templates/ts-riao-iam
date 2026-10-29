import { PasswordAuthentication } from '@riao/authn-password';
import { Principal } from '@riao/iam/auth';
import { isTokenValidationError, Jwt } from '@riao/crypto';
import { maindb } from '../../database/main';
import { env } from '../env';

export interface UserPrincipal extends Principal {
	login: string;
	password: string;
}

class UserAuthentication extends PasswordAuthentication<UserPrincipal> {}

export const authService = new UserAuthentication({ db: maindb });

export const jwtManager = new Jwt({
	secret: env.JWT_SECRET,
	algorithm: 'HS512',
	expiresIn: '12h',
});

export async function checkAccessToken(
	token: string
): Promise<false | { id: string }> {
	let payload: Record<string, unknown>;
	try {
		payload = await jwtManager.decodeToken(token);
	}
	catch (error) {
		if (isTokenValidationError(error)) {
			return false;
		}
		throw error;
	}

	if (typeof payload['userId'] !== 'string') {
		return false;
	}

	const principal = await authService.findActivePrincipal({
		where: { id: payload['userId'] },
	});

	return principal ? { id: principal.id } : false;
}
