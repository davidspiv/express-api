import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';

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

const addMany = (references: Reference[]) => {
	const dynamicQuery =
		'INSERT INTO refs ( ref_id, ref_date, ref_date_offset, ref_memo, ref_amount, src_id )VALUES ( @id, @date, @dateOffset, @memo, @amount, @srcId );';

	const filteredRefs = getFilteredRefs(references);

	const refIds = insertModels(dynamicQuery, filteredRefs);
	return refIds.length;
};

export { addMany };
