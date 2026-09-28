import { PasswordAuthentication } from '@riao/authn-password';
import { Principal } from '@riao/iam/auth';
import { Jwt } from '@riao/crypto';
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
