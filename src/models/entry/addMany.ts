import Database from 'better-sqlite3';
import dynamicQueries from '../../dev/dynamicQueries.js';
import { randomUUID } from 'node:crypto';

import type { User_Data, Entry_Input } from '../../types.js';

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
			const entryId = randomUUID();

			db
				.prepare(dynamicQueries.insertEntries)
				.run({ ...model, id: entryId, userId });

			// for (const lineItem of model.lineItems) {
			// 	const lineItemId = randomUUID();

			// 	db
			// 		.prepare(dynamicQueries.insertLineItems)
			// 		.run({ ...lineItem, id: lineItemId, entryId });
			// }

			idArr.push(entryId);
		}
	})();

	db.close();
	console.log(`${models.length} entries input successfully.`);
	return models[0];
};

export { insertEntries };
