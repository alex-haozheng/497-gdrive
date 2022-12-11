import {randomBytes} from 'crypto';
import { hash as hasher } from './hash.js';

// create a hashed password using user input password and randomly generated salt
export function generatePassword(password: string): { hash: string, salt: string } {
	const salt: string = randomBytes(32).toString('hex');
	const hashedPassword: string = hasher(password, salt);
	return {
		hash: hashedPassword,
		salt: salt
	};
}

// ensure user password hash matches database's hashed password
export function validatePassword(password: string, hash: string, salt: string): boolean {
	return hasher(password, salt) === hash;
}