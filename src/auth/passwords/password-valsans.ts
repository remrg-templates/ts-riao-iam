import { ComposedValSan, LengthValidator, UuidValSan } from 'valsan';

export const passwordValSans = {
	id: new UuidValSan(),
	principal_id: new UuidValSan(),
	password: new ComposedValSan([
		new LengthValidator({ minLength: 1, maxLength: 255 }),
	]),
};
