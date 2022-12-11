import { createHmac, pbkdf2Sync } from 'crypto';

function hashSimple(password: string, salt: string): string {
	return createHmac('sha256', 'secret')
		.update(password + salt)
		.digest('hex');
}

function hashExtreme(password: string, salt: string): string {
	let hashed = password;
	for (let i = 0; i < 1000000; ++i) {
		hashed = createHmac('sha256', 'secret')
		.update(hashed + salt)
		.digest('hex');
	}
	return hashed;
}

export function hash(password: string, salt: string): string {
	return pbkdf2Sync(password, salt, 1000000, 32, 'sha256').toString('hex');
}