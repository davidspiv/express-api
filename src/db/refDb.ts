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
	db.prepare(query).run(trans);
	db.close();
};

const dbAddAll = (query: string, transArr: Transaction[]) => {
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
