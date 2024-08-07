import { execDbTransaction, getData } from './utilDb.js';
import { parseQueries, parseCsv, parseOfx } from './utilParse.js';
import Database from 'better-sqlite3';
import type { Receipt } from '../models/classes.js';

const buildDb = (data: [string[], string[], Receipt[]]) => {
	const [schema, seed, receipts] = data;

	execDbTransaction(schema);
	console.log('Schema successful.');

	execDbTransaction(seed);
	console.log('Initial seed successful.');

	inputReceipts(receipts);
};

const inputReceipts = (csvData: Receipt[]) => {
	const db = new Database('accounting.db');

	const enterRcpt = db.transaction(() => {
		for (const rcpt of csvData) {
			const insertStatement = `
			INSERT INTO receipts (
				rcpt_id,
				rcpt_date,
				rcpt_date_offset,
				rcpt_amount,
				rcpt_memo,
				src_id
				)
			VALUES (@id, @date, @dateOffset, @amount, @memo, @srcId);
			`;
			//better-sql-3 will reject a class instance
			db.prepare(insertStatement).run({ ...rcpt, accId: 1001 });
		}
	});
	enterRcpt();
	db.close();
	console.log(`${csvData.length} receipts input successfully.`);
};

const main = async () => {
	try {
		const rawData = <string[]>(
			await Promise.all([
				getData('./src/dev/schema.sql'),
				getData('./src/dev/seed.sql'),
				getData('./testInputs/receipts(1).csv'),
			])
		);

		const [schemaData, seedData, csvData] = rawData;

		const parsedData: [string[], string[], Receipt[]] = [
			parseQueries(schemaData),
			parseQueries(seedData),
			parseCsv(csvData),
		];

		buildDb(parsedData);
	} catch (err) {
		console.log(err);
	}
};

main();
