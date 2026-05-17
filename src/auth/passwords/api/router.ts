import { RiaoRouter } from '@riao/rest';
import { passwordsRepo } from '..';
import { ResetPasswordEndpoint } from './reset';

export class PasswordsRouter extends RiaoRouter {
	override path = '/passwords';
	override repo = passwordsRepo;

	override async routes() {
		return [ResetPasswordEndpoint];
	}
}
