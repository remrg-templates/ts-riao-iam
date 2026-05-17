import { ObjectValSan, EmailValidator, LengthValidator } from 'valsan';
import { authService, jwtManager } from '../auth.service';
import { ApiRequest, PostEndpoint, UnauthorizedError } from 'api-machine';

export class LoginEndpoint extends PostEndpoint {
	override path = '/login';

	override body = new ObjectValSan({
		schema: {
			login: new EmailValidator(),
			password: new LengthValidator({ minLength: 6, maxLength: 255 }),
		},
	});

	public override async handle(req: ApiRequest) {
		const { login, password } = req.body;

		const user = await authService.authenticate({
			login: login,
			password: password,
		});

		if (!user) {
			throw new UnauthorizedError('Invalid credentials');
		}

		const { token } = await jwtManager.generateToken({
			userId: user.id,
			login: user.login,
			name: user.name,
			role: 'admin',
		});

		return {
			user: { id: user.id, login: user.login, name: user.name },
			token,
		};
	}
}
