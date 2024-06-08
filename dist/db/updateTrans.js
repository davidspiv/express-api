import Database from 'better-sqlite3';
const dbSelect = (id) => {
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
const dbUpdate = (trans) => {
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
export { dbSelect, dbUpdate };
