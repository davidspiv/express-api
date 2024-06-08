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
const dbSelectAll = (limit = 0) => {
    let selectStatement = `
	SELECT * FROM transactions
	ORDER BY trans_date DESC;
	`;
    if (limit) {
        const semicolonIndex = selectStatement.indexOf(';');
        selectStatement = selectStatement
            .slice(0, semicolonIndex)
            .concat('', ` LIMIT ${limit};`);
    }
    const db = new Database('accounting.db', {
        fileMustExist: true,
        readonly: true,
    });
    const result = db.prepare(selectStatement).all();
    db.close();
    return result;
};
const dbRunNoParams = (query) => {
    const db = new Database('accounting.db', { fileMustExist: true });
    db.prepare(query).run();
    db.close();
};
const dbAdd = (query, trans) => {
    const db = new Database('accounting.db', { fileMustExist: true });
    db.prepare(query).run(trans);
    db.close();
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
export { dbSelect, dbSelectSome, dbSelectAll, dbRunNoParams, dbAdd, dbAddAll };
