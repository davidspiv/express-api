import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import dynamicQueries from '../../dev/dynamicQueries.js';

import type { ReferenceData, ReferenceInput } from '../../interfaces.js';

const readLatest = (srcId: string) => {
	const selectStatement = `
		SELECT *
		FROM refs
		WHERE src_id = '${srcId}'
		ORDER BY ref_date
		DESC LIMIT 1;
		`;

	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});

	const result = db.prepare(selectStatement).all();

	db.close();
	return result;
};

const getSourceId = () => {
	const selectStatement = `
		SELECT *
		FROM sources;
		`;

	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});

	const result = <ReferenceData[]>db.prepare(selectStatement).all();

	db.close();
	return result[0].src_id;
};

const sortByDate = (refArr: ReferenceInput[]) => {
	const filterDate = (date: string) => {
		return new Date(Number.parseInt(date)).getTime();
	};

	return refArr.sort(
		(a: ReferenceInput, b: ReferenceInput) =>
			filterDate(b.date) - filterDate(a.date),
	);
};

const getSliceIndex = (recentDate: string, refArr: ReferenceInput[]) => {
	for (let i = 0; i < refArr.length; i++) {
		if (refArr[i].date <= recentDate) {
			return i;
		}
	}

	return refArr.length;
};

const removeDuplicateRefs = (srcId: string, refArr: ReferenceInput[]) => {
	const refLatest = <ReferenceData[]>readLatest(srcId);
	const latestDate = refLatest[0]?.ref_date;

	if (!latestDate) {
		return refArr;
	}

	const sortedRefArr = sortByDate(refArr);
	const sliceIndex = getSliceIndex(latestDate, sortedRefArr);
	const filteredRefArr = sortedRefArr.slice(0, sliceIndex);

	return filteredRefArr;
};

const insertRefs = (srcId: string, models: ReferenceInput[]) => {
	const db = new Database('accounting.db');
	const idArr: string[] = [];

	db.transaction(() => {
		for (const model of models) {
			const id = randomUUID();
			//better-sql-3 will reject a class instance
			db.prepare(dynamicQueries.insertRefs).run({ ...model, id, srcId });
			idArr.push(id);
		}
	})();

	db.close();
	console.log(`${models.length} references input successfully.`);
	return idArr;
};

export { getSourceId, removeDuplicateRefs, insertRefs };
