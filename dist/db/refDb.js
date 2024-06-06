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
    console.log(trans);
    db.prepare(query).run(trans);
    db.close();
};
export { dbSelect, dbRunNoParams, dbAdd };
