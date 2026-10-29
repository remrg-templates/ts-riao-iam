import { RiaoRouter } from '@riao/rest';
import { BearerAuthenticationScheme, RestServer } from 'api-machine';
import { RbacAuthorization } from '@riao/authz-rbac';
import { maindb } from '../../database/main';
import { checkAccessToken } from '../auth/auth.service';
import { env } from '../env';
import { ApiRouter } from './router';
import { ServiceRouter } from './service';

export class MainRouter extends RiaoRouter {
	override path = '/';

	protected override async routes() {
		return [ApiRouter, ServiceRouter];
	}
}

export class Server extends RestServer {
	override router = MainRouter;

	override name = '{{ remrg:var project-name }}';
	override description = 'Rest API Server';

	public constructor(port = env.API_PORT) {
		super({
			port,
			swaggerEnabled: env.NODE_ENV === 'development',
			authentication: new BearerAuthenticationScheme({
				checkToken: checkAccessToken,
			}),
			authorizer: new RbacAuthorization({ db: maindb }),
		});
	}
}

export const server = new Server();
