import { RiaoGetOneEndpoint } from '@riao/rest';
import { Principal } from '../principal';
import { ObjectValSan } from 'valsan';
import { principalValSans } from '../principal-valsans';

export class GetPrincipalEndpoint extends RiaoGetOneEndpoint<Principal> {
	override paramsExample = {
		id: 'uuid-of-principal',
	};

	override params = new ObjectValSan({
		schema: { id: principalValSans.id },
	});
}
