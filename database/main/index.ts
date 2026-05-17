import { DatabasePostgres17 } from '@riao/postgres';

import { env } from '../../src/env';

export default class MainDatabase extends DatabasePostgres17 {
	override name = 'main';

	override configureFromEnv(): void {
		this.env = {
			NODE_ENV: env.NODE_ENV,
			host: env.MAIN_DB_HOST,
			port: env.MAIN_DB_PORT,
			username: env.MAIN_DB_USER,
			password: env.MAIN_DB_PASSWORD,
			database: env.MAIN_DB_NAME,
		};
	}
}

export const maindb = new MainDatabase();
