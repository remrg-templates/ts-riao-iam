import { RiaoCreateEndpoint } from '@riao/rest';
import { Password } from '../password';
import { ObjectValSan } from 'valsan';
import { passwordValSans } from '../password-valsans';
import { authService } from '@/auth/auth.service';

export class ResetPasswordEndpoint extends RiaoCreateEndpoint<Password> {
	override path = '/reset';

	override body = new ObjectValSan({
		schema: {
			principal_id: passwordValSans.principal_id,
			password: passwordValSans.password,
		},
	});

	override bodyExample = {
		principal_id: '123e4567-e89b-12d3-a456-426614174000',
		password: 'password123',
	};

	override async handle(data: {
		body: { principal_id: string; password: string };
	}) {
		await authService.changePassword(
			data.body.principal_id,
			data.body.password
		);

		return {};
	}
}
