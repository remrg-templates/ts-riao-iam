import { RiaoRouter } from '@riao/rest';
import { principalsRepo } from '..';
import { CreatePrincipalEndpoint } from './create';
import { SearchPrincipalsEndpoint } from './search';
import { GetPrincipalEndpoint } from './get-one';
import { UpdatePrincipalEndpoint } from './update';
import { DeletePrincipalEndpoint } from './delete';

export class PrincipalsRouter extends RiaoRouter {
	override path = '/principals';
	override repo = principalsRepo;

	override async routes() {
		return [
			CreatePrincipalEndpoint,
			SearchPrincipalsEndpoint,
			GetPrincipalEndpoint,
			UpdatePrincipalEndpoint,
			DeletePrincipalEndpoint,
		];
	}
}
