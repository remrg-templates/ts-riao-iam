import { RiaoRouter } from '@riao/rest';
import { HealthCheckEndpoint } from 'api-machine';

export class ServiceRouter extends RiaoRouter {
	override authentication = null;
	override authorization = null;

	override async routes() {
		return [HealthCheckEndpoint];
	}
}
