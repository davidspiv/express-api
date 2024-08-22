import Database from 'better-sqlite3';
import type { Reference } from './00_interfaces.js';

export default (refArr: Reference[]) => {
	const db = new Database('accounting.db', { fileMustExist: true });
	const updateMany = db.transaction(() => {
		for (const ref of refArr) {
			const { id, date, dateOffset, amount, memo, srcId } = ref;
			const query = `
        UPDATE refs
        SET
          ref_date = '${date}',
          ref_date_offset = ${dateOffset},
          ref_amount = ${amount},
          ref_memo = '${memo}',
          src_id = ${srcId},
        WHERE ref_id = '${id}';
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
