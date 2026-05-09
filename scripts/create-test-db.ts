import { maindb } from '../database/main';
import { testEnv } from '../test/test-env';

// Add this flag to run app's register/teardown
export const bootstrap = true;

/**
 * Do something!
 */
export default async function example(): Promise<void> {
	await maindb.getDataDefinitionRepository().createDatabase({
		name: testEnv.TEST_DB_NAME,
	});
}
