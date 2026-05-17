import { maindb } from '../../../database/main';
import { Principal } from './principal';

export const principalsRepo = maindb.getQueryRepository<Principal>({
	table: 'iam_principals',
	identifiedBy: 'id',
});
