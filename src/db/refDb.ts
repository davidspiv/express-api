import Database from 'better-sqlite3';
import type { Transaction } from '../interfaces.js';

const dbSelect = (query: string) => {
	const db = new Database('accounting.db', { fileMustExist: true });
	const result = db.prepare(query).all();
	db.close();
	return result;
};

const dbRunNoParams = (query: string) => {
	const db = new Database('accounting.db', { fileMustExist: true });
	db.prepare(query).run();
	db.close();
};

const dbAdd = (query: string, trans: Transaction) => {
	const db = new Database('accounting.db', { fileMustExist: true });
	console.log(trans)
	db.prepare(query).run(trans);
	db.close();
};

export { dbSelect, dbRunNoParams, dbAdd };
