import { RiaoUpdateEndpoint } from '@riao/rest';
import { Principal } from '../principal';
import { ObjectValSan } from 'valsan';
import { principalValSans } from '../principal-valsans';

export class UpdatePrincipalEndpoint extends RiaoUpdateEndpoint<Principal> {
	override params = new ObjectValSan({
		schema: { id: principalValSans.id },
	});

	override paramsExample = {
		id: 'uuid-of-principal',
	};

	override body = new ObjectValSan({
		schema: {
			login: principalValSans.login.copy({ isOptional: true }),
			name: principalValSans.name.copy({ isOptional: true }),
		},
	});

	override bodyExample = {
		name: 'John Doe',
	};
}
