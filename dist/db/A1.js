import Database from 'better-sqlite3';
const readLatestTrans = (userId, accCode) => {
    const selectStatement = `
		SELECT *
		FROM transactions
		WHERE user_id = '${userId}'
		AND acc_code = ${accCode}
		ORDER BY trans_date
		DESC LIMIT 1;
		`;
    const db = new Database('accounting.db', {
        fileMustExist: true,
        readonly: true,
    });
    const result = db.prepare(selectStatement).all();
    db.close();
    return result;
};
