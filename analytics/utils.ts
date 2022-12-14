import { File } from './interfaces.js';

export function processFiles(files: File[]): number[] {
	const indexes: number[] = [];
	for (const file of files) {
		const sentences: string[] = file.content.split('[\\p{Punct}\\s]+');
		const words: string[] = file.content.split(/[^a-zA-Z\d]/);
		const letters: string[] = words.join('').split('');
		const L: number = (letters.length / words.length) * 100;
		const S: number = (sentences.length / letters.length) * 100;
		// uses Coleman-Liau index https://en.wikipedia.org/wiki/Coleman–Liau_index
		// L = avg number of letters per 100 words
		// W = avg number of sentences per 100 words
		// index = 0.0588 * L - 0.296 * S - 15.8;
		const index: number = 0.0588 * L - 0.296 * S - 15.8;
		indexes.push(Math.floor(index));
	}
	return indexes.map(n => Math.floor(n)).sort((a, b) => (a <= b ? -1 : 1));
}

export function condense(data: number[]): { [key: string | number]: number } {
	let i: number = 0;
	const distribution: { [key: string | number]: number } = {};
	while (i < data.length) {
		let j: number = i;
		while (data[++i] === data[j]);
		distribution[data[j]] = i - j;
	}
	return distribution;
} // condense same data to one point and count. Ex: 1 1 1 1 2 2 2 => { 1: 4, 2: 3 }