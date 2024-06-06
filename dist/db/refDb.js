import Database from 'better-sqlite3';
const dbSelect = (query) => {
    const db = new Database('accounting.db', { fileMustExist: true });
    const result = db.prepare(query).all();
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
                accId: trans.accId,
                userId: trans.userId,
            });
        }
    });
    insertMany(transArr);
    db.close();
};
export { dbSelect, dbRunNoParams, dbAdd, dbAddAll };
