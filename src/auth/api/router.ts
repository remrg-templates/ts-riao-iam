import { RiaoRouter } from '@riao/rest';
import { LoginEndpoint } from './controller';

export class AuthRouter extends RiaoRouter {
	override path = '/auth';

	protected override async routes() {
		return [LoginEndpoint];
	}
}
