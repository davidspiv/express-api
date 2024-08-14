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

	const enterReference = db.transaction(() => {
		for (const reference of csvData) {
			const refId = randomUUID()

			const sqlInsertRefs = `
			INSERT INTO refs (
				ref_id,
				ref_date,
				ref_date_offset,
				ref_amount,
				src_id
				)
			VALUES (@refId, @date, @dateOffset, @amount, @srcId);
			`;
			//better-sql-3 will reject a class instance
			db.prepare(sqlInsertRefs).run({ ...reference, refId, srcId: 1 });

			const sqlInsertMemos = `
			INSERT OR IGNORE INTO memos (
				memo_text,
				ref_id
				)
			VALUES (@memo, @refId);
			`;

			db.prepare(sqlInsertMemos).run({ memo: reference.memo, refId });
		}
	});
	enterReference();
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
