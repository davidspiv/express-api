import Database from 'better-sqlite3';
import dynamicQueries from '../../dev/dynamicQueries.js';
import { randomUUID } from 'node:crypto';

import type { User_Data, Entry_Input } from '../../interfaces.js';

const getUserId = () => {
	const selectStatement = `
		SELECT *
		FROM users;
		`;

	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});

	const result = <User_Data[]>db.prepare(selectStatement).all();

	db.close();
	return result[0].user_id;
};

const insertEntries = (models: Entry_Input[]) => {
	const idArr: string[] = [];
	const userId = getUserId();
	const db = new Database('accounting.db');

	db.transaction(() => {
		for (const model of models) {
			const id = randomUUID();

			//better-sql-3 will reject a class instance
			db.prepare(dynamicQueries.insertEntries).run({ ...model, id, userId });
			idArr.push(id);
		}
	})();

	db.close();
	console.log(`${models.length} entries input successfully.`);
	return idArr;
};

export { insertEntries };
