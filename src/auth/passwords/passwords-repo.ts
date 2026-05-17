import { maindb } from '../../../database/main';
import { Password } from './password';

export const passwordsRepo = maindb.getQueryRepository<Password>({
	table: 'iam_passwords',
	identifiedBy: 'id',
});
