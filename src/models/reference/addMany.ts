import { randomUUID } from 'node:crypto';
import { insertModels } from '../../dev/utilDb.js';
import Database from 'better-sqlite3';
import dynamicQueries from '../../dev/dynamicQueries.js';

import type { Reference, ReferenceData } from '../../interfaces.js';

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

const sortByDate = (refArr: Reference[]) => {
	const filterDate = (date: string) => {
		return new Date(Number.parseInt(date)).getTime();
	};
	refArr.sort(
		(a: Reference, b: Reference) => filterDate(b.date) - filterDate(a.date),
	);
};

const getFilteredRefs = (references: Reference[]): Reference[] => {
	const recentDbRef = <ReferenceData | null>(
		readLatest(references[0].srcId as string)[0]
	);

	const getSliceIndex = (recentDbRef: ReferenceData) => {
		const id = recentDbRef.ref_id;
		if (!id) return 0;
		for (let i = 0; i < references.length; i++) {
			if (references[i].id === id) return i;
		}
		return references.length;
	};

	if (recentDbRef) {
		const sortedInputRefArr = sortByDate(references);
		const sliceIndex = getSliceIndex(recentDbRef);
		const filteredRefArr = references.slice(0, sliceIndex);
	}

	const buildInputRefArr = () => {
		const arr: Reference[] = [];

		for (let i = 0; i < references.length; i++) {
			//move data creation to model
			const id = randomUUID();
			const { date, dateOffset, amount, memo, srcId } = references[i];
			const ref = {
				id,
				date,
				dateOffset,
				amount,
				memo,
				srcId,
			};
			arr.push(ref);
		}
		return arr;
	};

	return buildInputRefArr();
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

const addMany = (refArr: Reference[]): string => {
	const sourceId = getSourceId();

	refArr.map((ref) => {
		ref.srcId = sourceId;
		return ref;
	});

	// const filteredRefs = getFilteredRefs(references);

	try {
		const refIds = insertModels(dynamicQueries.insertRefs, refArr);

		console.log(`${refIds.length} references submitted`);
		return String(refIds);
	} catch (error) {
		return String(error);
	}
};

export { addMany };
