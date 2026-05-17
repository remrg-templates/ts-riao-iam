import { AppConfig, configure } from 'ts-appconfig';

/**
 * Test Environment Variables Schema
 */
export class TestEnvironment extends AppConfig {
	override readonly NODE_ENV = 'test';

	readonly TEST_DB_NAME: string = 'test_db';
}

/**
 * Load & export environment variables
 */
export const testEnv: TestEnvironment = configure(TestEnvironment, {
	relativePath: '.env.test',
});
