import { RiaoRouter } from '@riao/rest';
import { AuthRouter } from '@/auth/api/router';
import { PrincipalsRouter } from '@/auth/principals/api';
import { PasswordsRouter } from '@/auth/passwords/api';

export class V1Router extends RiaoRouter {
	override path = '/v1';

	protected override async routes() {
		return [
			/* TODO: Start adding routes! */
			AuthRouter,
			PasswordsRouter,
			PrincipalsRouter,
		];
	}
}

export class ApiRouter extends RiaoRouter {
	override path = '/api';

	protected override async routes() {
		return [V1Router];
	}
}
