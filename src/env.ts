import { AppConfig, configure } from 'ts-appconfig';

/**
 * Environment Variables Schema
 */
export class Environment extends AppConfig {
	readonly APP_TITLE = '{{ remrg:var project-name }}';

	readonly API_PORT = 9000;

	readonly MAIN_DB_HOST: string = 'postgres';
	readonly MAIN_DB_PORT: number = 5432;
	readonly MAIN_DB_USER: string = 'postgres';
	readonly MAIN_DB_PASSWORD: string = 'postgres';
	readonly MAIN_DB_NAME: string = 'main-db';
}

/**
 * Load & export environment variables
 */
export const env: Environment = configure(Environment);
