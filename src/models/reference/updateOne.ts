import Database from 'better-sqlite3';
import type { Reference } from '../../types.js';

export default (ref: Reference) => {
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
	const db = new Database('accounting.db', { fileMustExist: true });
	db.prepare(query).run();
	db.close();
};
