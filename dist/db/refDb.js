import Database from 'better-sqlite3';
const dbSelect = (id) => {
    const selectStatement = `
	SELECT *
	FROM transactions
	WHERE trans_id = '${id}';
`;
    const db = new Database('accounting.db', { fileMustExist: true });
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
    const db = new Database('accounting.db', { fileMustExist: true });
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
const dbAddAll = (query, transArr) => {
    const db = new Database('accounting.db', { fileMustExist: true });
    const statement = db.prepare(query);
    const insertMany = db.transaction((transArr) => {
        for (const trans of transArr) {
            statement.run({
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
export { dbSelect, dbSelectAll, dbRunNoParams, dbAdd, dbAddAll };
