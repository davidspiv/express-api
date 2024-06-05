import Database from 'better-sqlite3';
const refDb = (query) => {
    const db = new Database('accounting.db', { fileMustExist: true });
    return db.prepare(query).all();
};
export { refDb };
