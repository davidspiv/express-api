import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import Database from 'better-sqlite3';

const getDataPromises = (fileNames: string[]) => {
	return fileNames.map((fileName) =>
		readFile(fileName, {
			encoding: 'utf8',
		}),
	);
};

const buildSchema = (queries: string[]) => {
	const db = new Database('accounting.db');
	db.transaction(() => {
		for (const query of queries) {
			db.prepare(query).run();
		}
	})();
	db.close();
	console.log('Schema successful.');
};

const insertModels = (queryDynamic: string, models: object[]): string[] => {
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

export { getDataPromises, buildSchema, insertModels };
