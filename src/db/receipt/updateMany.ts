import Database from 'better-sqlite3';
import type { Receipt } from '../../models/classes.js';

export default (rcptArr: Receipt[]) => {
	const db = new Database('accounting.db', { fileMustExist: true });
	const updateMany = db.transaction(() => {
		for (const rcpt of rcptArr) {
			const { id, date, dateOffset, amount, memo, srcId } = rcpt;
			const query = `
        UPDATE receipts
        SET
          rcpt_date = '${date}',
          rcpt_date_offset = ${dateOffset},
          rcpt_amount = ${amount},
          rcpt_memo = '${memo}',
          src_id = ${srcId},
        WHERE rcpt_id = '${id}';
        `;

			const statement = db.prepare(query);

			statement.run({
				date,
				dateOffset,
				amount,
				memo,
				srcId,
			});
		}
	});
	updateMany();
	db.close();
};
