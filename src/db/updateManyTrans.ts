import Database from 'better-sqlite3';
import type { Transaction } from '../interfaces/interfaces.js';

const dbSelect = (id: string) => {
	const selectStatement = `
	SELECT *
	FROM transactions
	WHERE trans_id = '${id}';
	`;
	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});
	const result = db.prepare(selectStatement).all();
	db.close();
	return result;
};

const dbUpdateAll = (transArr: Transaction[]) => {
	const db = new Database('accounting.db', { fileMustExist: true });
	const updateMany = db.transaction(() => {
		for (const trans of transArr) {
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

			const statement = db.prepare(query);

			statement.run({
				date,
				dateOffset,
				amount,
				memo,
				accCode,
				userId,
			});
		}
	});
	updateMany();
	db.close();
};

export { dbSelect, dbUpdateAll };
