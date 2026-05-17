import {
	RiaoSearchEndpoint,
	RiaoSearchColumn,
} from '@riao/rest/endpoints/search-endpoint';
import { Principal } from '../principal';

export class SearchPrincipalsEndpoint extends RiaoSearchEndpoint<Principal> {
	override bodyExample = {
		limit: 10,
		offset: 0,
		order: [{ column: 'name', direction: 'ASC' }],
	};

	protected override getColumnMap(): Record<
		string,
		RiaoSearchColumn<Principal>
	> {
		return {
			login: { column: 'login' },
			name: { column: 'name' },
			create_timestamp: { column: 'create_timestamp' },
		};
	}
}
