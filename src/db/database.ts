import { getData, parseCsv, parseOfx } from './utils.js';
import Database from 'better-sqlite3';

const createDatabase = async () => {
	const query = await getData('sql/create_table.sql');
	if (query) {
		const db = new Database('accounting.db');
		db.prepare(query).run();
		return db;
	}
};

const populateDb = async (db: Database.Database) => {
	const transactions = await parseOfx();
	const insertRow = db.prepare(
		'INSERT INTO transactions (trans_type, date_posted, amount, memo, fitid) VALUES (@transType, @datePosted, @amount, @memo, @fitid);',
	);
	if (transactions) {
		const insertData = db.transaction(() => {
			//https://github.com/WiseLibs/better-sqlite3/issues/741
			for (const trans of transactions) {
				insertRow.run({
					transType: trans.transType,
					datePosted: trans.datePosted,
					amount: trans.amount,
					memo: trans.memo,
					fitid: trans.fitid,
				});
			}
		});

		insertData();
		db.close();
	}
};

const db = await createDatabase();
if (db) {
	populateDb(db);
} else {
	console.log('error creating db');
}
