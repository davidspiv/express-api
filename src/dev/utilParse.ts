import { getData } from './utilDb.js';
import type { Reference } from '../interfaces.js';
const { randomUUID } = await import('node:crypto');

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
		buildRcptObj(csvData);
	} else {
		console.log('Error with getData()');
	}

	return references;

	function buildRcptObj(data: string) {
		const csvValues = splitCsv(data.replace(/[\n]/g, ','));
		const totalCol = 7;

		let lastDate: string | null = null;
		let dateOffset = 0;

		for (let i = 1; i < Math.floor(csvValues.length / totalCol); i++) {
			const id = randomUUID();
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
			const srcId = 1;

			const rcptObj = { id, date, dateOffset, amount, memo, srcId };

			references.push(rcptObj);
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

const parseOfx = async () => {
	const references = [];
	const ofxString = await getData('./inputs/debit.ofx');
	const objectify = (ofxData: string) => {
		const rcptType = ofxData.slice(
			ofxData.indexOf('<TRNTYPE>') + 9,
			ofxData.indexOf('</TRNTYPE'),
		);
		const datePosted = ofxData.slice(
			ofxData.indexOf('<DTPOSTED>') + 10,
			ofxData.indexOf('</DTPOSTED>'),
		);
		const dateAvailable = ofxData.slice(
			ofxData.indexOf('<DTAVAIL>') + 9,
			ofxData.indexOf('</DTAVAIL>'),
		);
		const amount = ofxData.slice(
			ofxData.indexOf('<TRNAMT>') + 8,
			ofxData.indexOf('</TRNAMT>'),
		);
		const fitid = ofxData.slice(
			ofxData.indexOf('<FITID>') + 7,
			ofxData.indexOf('</FITID>'),
		);
		const rcptName = ofxData.slice(
			ofxData.indexOf('<NAME>') + 6,
			ofxData.indexOf('</NAME>'),
		);
		const memo = ofxData.slice(
			ofxData.indexOf('<MEMO>') + 6,
			ofxData.indexOf('</MEMO>'),
		);

		return { rcptType, datePosted, amount, memo, fitid };
	};

	if (ofxString) {
		const ofxDataArr = ofxString.split('<STMTTRN>');
		//skip first AND last el
		for (let i = 1; i < ofxDataArr.length - 1; i++) {
			const reference = objectify(ofxDataArr[i]);
			references.push(reference);
		}
		return references;
	}
	console.log('Error with getData()');
};

export { parseQueries, parseCsv, parseOfx };
