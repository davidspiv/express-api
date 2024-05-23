import { getData, parseCsv, parseOfx } from './utils.js';
import Database from 'better-sqlite3';

const createDatabase = async () => {
	const query = await getData('sql/create_table.sql');
	if (query) {
		const db = new Database('accounting.db');
		db.exec(query);
		return db;
	}
};

const populateDb = async () => {
	const promises = () => {
		const db = createDatabase();
		// const transactions = parseCsv('DEBIT');
		const transactions = parseOfx();
		const queryInsert = getData('sql/insert_transactions.sql');
		return Promise.all([db, transactions, queryInsert]);
	};
	const [db, transactions, queryInsert] = await promises();
	if (db && transactions && queryInsert) {
		const insertRow = db.prepare(
			'INSERT INTO transactions (trans_type, date_posted, date_available, amount, fitid, trans_name, memo) VALUES (@transType , @datePosted, @dateAvailable, @amount, @fitid, @transName, @memo);',
		);

		const insertData = db.transaction(() => {
			for (const trans of transactions) {
				insertRow.run(trans);
			}
		});

		insertData();
		db.close();
	}
};

populateDb();
