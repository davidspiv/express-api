import { getQueries, execDbTransaction } from './utilDb.js';
import { parseCsv, parseOfx } from './utilParse.js';
import Database from 'better-sqlite3';
import type { Receipt } from '../models/classes.js';

try {
	const data = <[string[], string[], Receipt[]]>(
		await Promise.all([
			getQueries('./src/dev/schema.sql'),
			getQueries('./src/dev/seed.sql'),
			parseCsv('./testInputs/receipts(1).csv'),
		])
	);

	buildDb(data);
} catch (err) {
	console.log(err);
}

function buildDb(data: [string[], string[], Receipt[]]) {
	const [schemaData, seedData, rcptArr] = data;

	execDbTransaction(schemaData);
	console.log('Schema successful.');

	execDbTransaction(seedData);
	console.log('Initial seed successful.');

	inputRcpt(rcptArr);

	function inputRcpt(rcptArr: Receipt[]) {
		const db = new Database('accounting.db');

		const enterRcpt = db.transaction(() => {
			for (const rcpt of rcptArr) {
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
		console.log(`${rcptArr.length} receipts input successfully.`);
	}
}
