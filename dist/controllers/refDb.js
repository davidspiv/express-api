import Database from 'better-sqlite3';
export default (query) => {
    const db = new Database('accounting.db', { fileMustExist: true });
    return db.prepare(query).all();
};
