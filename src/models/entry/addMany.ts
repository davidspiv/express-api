import Database from 'better-sqlite3';
import dynamicQueries from '../dynamicQueries.js';
import { randomUUID } from 'node:crypto';

import type { User_Data, Entry_Input } from '../types.js';

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

const insertEntries = (entries: Entry_Input[]) => {
	const idArr: string[] = [];
	const userId = getUserId();
	const db = new Database('accounting.db');

	db.transaction(() => {
		for (const entry of entries) {
			const entryId = randomUUID();

			//TABLE entries
			db
				.prepare(dynamicQueries.insertEntries)
				.run({ ...entry, id: entryId, userId });

			for (const lineItem of entry.lineItems) {
				const lineItemId = randomUUID();

				//TABLE line-items
				db.prepare(dynamicQueries.insertLineItems).run({
					...lineItem,
					id: lineItemId,
					entryId,
				});
			}

			//TABLE entry-refs
			db.prepare(dynamicQueries.insertEntryRefs).run({
				refId: entry.refId,
				entryId,
			});

			idArr.push(entryId);
		}
	})();

	db.close();
	console.log(`${entries.length} entries input successfully.`);
	return entries[0];
};

export { insertEntries };
