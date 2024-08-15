import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import Database from 'better-sqlite3';

const readFileUtf8 = async (fileName: string) => {
	const contents = await readFile(fileName, {
		encoding: 'utf8',
	});
	return contents;
};

const getData = (fileNames: string[]) => {
	return fileNames.map((fileName) => readFileUtf8(fileName));
};

const execTransaction = (queries: string[]) => {
	const db = new Database('accounting.db');
	db.transaction(() => {
		for (const query of queries) {
			db.prepare(query).run();
		}
	})();
	db.close();
	console.log('Transaction successful.');
};

const execTransactionBound = (
	queryDynamic: string,
	models: object[],
): string[] => {
	const db = new Database('accounting.db');
	const idArr: string[] = [];

	db.transaction(() => {
		for (const model of models) {
			const id = randomUUID();
			//better-sql-3 will reject a class instance
			db.prepare(queryDynamic).run({ ...model, id });
			idArr.push(id);
		}
	})();
	db.close();
	console.log(`${models.length} models input successfully.`);
	return idArr;
};

export { getData, execTransaction, execTransactionBound };
