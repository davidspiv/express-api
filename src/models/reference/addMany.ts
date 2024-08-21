import { insertModels } from '../../dev/utilDb.js';
import Database from 'better-sqlite3';
import dynamicQueries from '../../dev/dynamicQueries.js';

import type {
	ReferenceData,
	ReferenceInput,
} from '../../interfaces.js';

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
		if (refArr[i].date === recentDate) {
			return i;
		}
	}

	return refArr.length;
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

const addMany = (refArr: ReferenceInput[]): string => {
	const srcId = getSourceId();
	const refLatest = <ReferenceData[]>readLatest(srcId);
	const latestDate = refLatest[0]?.ref_date;

	const filteredRefArr: ReferenceInput[] = [];
	if (latestDate) {
		const sortedRefArr = latestDate ? sortByDate(refArr) : refArr;
		const sliceIndex = getSliceIndex(latestDate, sortedRefArr);
		console.log(sliceIndex);
		filteredRefArr.push(...sortedRefArr.slice(0, sliceIndex));
	} else {
		filteredRefArr.push(...refArr);
	}

	const modifiedRefArr = filteredRefArr.map((ref) => ({ ...ref, srcId }));

	try {
		const refIds = insertModels(dynamicQueries.insertRefs, modifiedRefArr);

		console.log(`${refIds.length} references submitted`);
		return String(refIds);
	} catch (error) {
		return String(error);
	}
};

export { addMany };
