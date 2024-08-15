import { readFile } from 'node:fs/promises';
import Database from 'better-sqlite3';
import type { Reference } from '../interfaces.js';

const getData = async (fileName: string) => {
	const contents = await readFile(fileName, {
		encoding: 'utf8',
	});
	return contents;
};

const execTransaction = (queries: string[]) => {
	const db = new Database('accounting.db');
	db.transaction(() => {
		for (const query of queries) {
			db.prepare(query).run();
		}
	})();
	db.close();
};

const execTransactionBound = (queryDynamic: string, models: Reference[]) => {
	const db = new Database('accounting.db');
	db.transaction(() => {
		for (const model of models) {
			//better-sql-3 will reject a class instance
			db.prepare(queryDynamic).run({ ...model });
		}
	})();
	db.close();
};

export { getData, execTransaction, execTransactionBound };
