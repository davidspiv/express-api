import Database from 'better-sqlite3';
const dbSelectSome = (userId, accCode) => {
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
const dbAddAll = (transArr) => {
    const db = new Database('accounting.db', { fileMustExist: true });
    const query = `
	INSERT INTO
		transactions (trans_id, trans_date, trans_date_offset, trans_amount, trans_memo, acc_code, user_id)
	VALUES
		(@id, @date, @dateOffset, @amount, @memo, @accCode, @userId);
	`;
    const statement = db.prepare(query);
    const insertMany = db.transaction((transArr) => {
        for (const trans of transArr) {
            statement.run({
                id: trans.id,
                date: trans.date,
                dateOffset: trans.dateOffset,
                amount: trans.amount,
                memo: trans.memo,
                accCode: trans.accCode,
                userId: trans.userId,
            });
        }
    });
    insertMany(transArr);
    db.close();
};
export { dbSelectSome, dbAddAll };
