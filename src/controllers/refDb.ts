import Database from 'better-sqlite3';

export default (query: string) => {
	const db = new Database('accounting.db', { fileMustExist: true });
	return db.prepare(query).all();
};
