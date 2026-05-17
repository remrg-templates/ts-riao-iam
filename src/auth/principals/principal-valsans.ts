import {
	ComposedValSan,
	EmailValidator,
	EnumValidator,
	LengthValidator,
	TrimSanitizer,
	UuidValSan,
} from 'valsan';

export const principalValSans = {
	id: new UuidValSan(),
	login: new ComposedValSan([
		new LengthValidator({ minLength: 1, maxLength: 255 }),
		new EmailValidator(),
	]),
	name: new ComposedValSan([
		new LengthValidator({
			minLength: 1,
			maxLength: 255,
		}),
	]),
	type: new ComposedValSan([
		new TrimSanitizer(),
		new EnumValidator({
			allowedValues: ['user', 'service-account'],
		}),
	]),
};
