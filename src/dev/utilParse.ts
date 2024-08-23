import fakeMemos from './fakeMemos.js';

import type { Reference_Input, Reference } from '../models/types.js';

function parseQueries(data: string) {
	const queryArr = data.split(/(?<=;)/g);

	const filteredQueryArr = queryArr.filter((query) => {
		const firstWord = query.trim().split(' ')[0];
		return firstWord === 'CREATE' || firstWord === 'INSERT';
	});

	return filteredQueryArr;
}

const splitCsv = (str: string) => {
	const obj: { soFar: string[]; isConcatting: boolean } = {
		soFar: [],
		isConcatting: false,
	};
	return str.split(',').reduce((accum, curr) => {
		if (accum.isConcatting) {
			accum.soFar[accum.soFar.length - 1] += `,${curr}`;
		} else {
			accum.soFar.push(curr);
		}
		if (curr.split('"').length % 2 === 0) {
			accum.isConcatting = !accum.isConcatting;
		}
		return accum;
	}, obj).soFar;
};

const buildReference = (data: string) => {
	const references: Reference_Input[] = [];
	const csvValues = splitCsv(data.replace(/[\n]/g, ','));
	const totalCol = 7;

	let lastDate: string | null = null;
	let dateOffset = 0;

	for (let i = 1; i < Math.floor(csvValues.length / totalCol); i++) {
		const date = new Date(csvValues[i * totalCol]).toISOString();

		if (lastDate === date) {
			dateOffset++;
		} else {
			dateOffset = 0;
			lastDate = date;
		}

		const amount = Math.round(
			Number.parseInt(
				(Number.parseFloat(csvValues[i * totalCol + 5]) * 100).toFixed(2),
			),
		);

		const memo = csvValues[i * totalCol + 1];
		// const memo = fakeMemos[Math.floor(Math.random() * (fakeMemos.length - 1))];

		const reference = { date, dateOffset, amount, memo };

		references.push(reference);
	}
	return references;
};

const parseCsv = (csvData: string) => {
	if (csvData) {
		return buildReference(csvData);
	}
	console.log('Error with getData()');
	return [];
};

export { parseQueries, parseCsv };
