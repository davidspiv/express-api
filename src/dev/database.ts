import { execDbTransaction, getData } from './utilDb.js';
import { parseQueries, parseCsv, parseOfx } from './utilParse.js';
import Database from 'better-sqlite3';
import type { Receipt } from '../definitions/classes.js';
const { randomUUID } = await import('node:crypto');

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

	db.transaction(() => {
		for (const reference of csvData) {

			const sqlInsertRefs = `
			INSERT INTO refs (
				ref_date,
				ref_date_offset,
				ref_memo,
				ref_amount,
				src_id
				)
			VALUES (@date, @dateOffset, @memo, @amount, @srcId);
			`;

			//better-sql-3 will reject a class instance
			db.prepare(sqlInsertRefs).run({ ...reference, srcId: 1 });
		}
	})();

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
