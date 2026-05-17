import { RiaoCreateEndpoint } from '@riao/rest';
import { Principal } from '../principal';
import { ObjectValSan } from 'valsan';
import { principalValSans } from '../principal-valsans';

export class CreatePrincipalEndpoint extends RiaoCreateEndpoint<Principal> {
	override body = new ObjectValSan({
		schema: {
			login: principalValSans.login,
			name: principalValSans.name,
			type: principalValSans.type,
		},
	});

	override bodyExample = {
		login: 'johndoe@example.com',
		name: 'John Doe',
		type: 'user',
	};
}
