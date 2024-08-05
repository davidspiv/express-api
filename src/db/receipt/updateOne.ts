import Database from 'better-sqlite3';
import type { Receipt } from '../../models/classes.js';

export default (rcpt: Receipt) => {
	const { id, date, dateOffset, amount, memo, accId } = rcpt;
	const query = `
	UPDATE receipts
	SET
		rcpt_date = '${date}',
		rcpt_date_offset = ${dateOffset},
		rcpt_amount = ${amount},
		rcpt_memo = '${memo}',
		src_id = ${accId},
	WHERE rcpt_id = '${id}';
	`;
	const db = new Database('accounting.db', { fileMustExist: true });
	db.prepare(query).run();
	db.close();
};
