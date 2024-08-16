import type { Reference } from '../interfaces.js';

const references: Reference[] = [];

function parseQueries(data: string) {
	const queryArr = data.split(/(?<=;)/g);

	const filteredQueryArr = queryArr.filter((query) => {
		const firstWord = query.trim().split(' ')[0];
		return firstWord === 'CREATE' || firstWord === 'INSERT';
	});

	return filteredQueryArr;
}

const parseCsv = (csvData: string) => {
	if (csvData) {
		buildRefObj(csvData);
	} else {
		console.log('Error with getData()');
	}

	return references;

	function buildRefObj(data: string) {
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

			const refObj = { id: null, date, dateOffset, amount, memo, srcId: null };

			references.push(refObj);
		}
	}

	function splitCsv(str: string) {
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
	}
};

export { parseQueries, parseCsv };
