import Database from 'better-sqlite3';
import type { Transaction } from '../models/classes.js';

export default (trans: Transaction) => {
	const { id, date, dateOffset, amount, memo, accCode, userId } = trans;
	const query = `
	UPDATE transactions
	SET
		trans_date = '${date}',
		trans_date_offset = ${dateOffset},
		trans_amount = ${amount},
		trans_memo = '${memo}',
		acc_code = ${accCode},
		user_id = '${userId}'
	WHERE trans_id = '${id}';
	`;
	const db = new Database('accounting.db', { fileMustExist: true });
	db.prepare(query).run();
	db.close();
};
