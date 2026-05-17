import { RiaoDeleteEndpoint } from '@riao/rest';
import { Principal } from '../principal';
import { ObjectValSan } from 'valsan';
import { principalValSans } from '../principal-valsans';

export class DeletePrincipalEndpoint extends RiaoDeleteEndpoint<Principal> {
	override params = new ObjectValSan({
		schema: { id: principalValSans.id },
	});

	override paramsExample = {
		id: 'uuid-of-principal',
	};
}
