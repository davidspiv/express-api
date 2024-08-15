import { execDbTransaction, getData } from './utilDb.js';
import { parseQueries, parseCsv, parseOfx } from './utilParse.js';
import Database from 'better-sqlite3';
import type { Reference } from '../interfaces.js';

const inputReferences = (csvData: Reference[]) => {
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
	console.log(`${csvData.length} references input successfully.`);
};

const buildDb = (data: [string[], string[], Reference[]]) => {
	const [schema, seed, references] = data;

	execDbTransaction(schema);
	console.log('Schema successful.');

	execDbTransaction(seed);
	console.log('Initial seed successful.');

	inputReferences(references);
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

		const parsedData: [string[], string[], Reference[]] = [
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
