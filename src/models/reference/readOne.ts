import Database from 'better-sqlite3';

import type { Reference } from '../../interfaces.js';
import type { ReferenceData } from '../../interfaces.js';

export default (id: string) => {
	const selectStatement = `
	SELECT *
	FROM references
	WHERE ref_id = '${id}';
	`;
	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});

	const resultArr = db.prepare(selectStatement).all();
	db.close();

	const resultEl = resultArr[0];
	const refArr: Reference[] = [];

	if (!isRef(resultEl)) return;

	const reference: Reference = {
		id: resultEl.ref_id,
		date: resultEl.ref_date,
		dateOffset: resultEl.ref_date_offset,
		memo: resultEl.ref_memo,
		amount: resultEl.ref_amount,
		srcId: resultEl.src_id,
		fitid: resultEl.ref_fitid,
	};

	refArr.push(reference);

	return refArr;
};

function isRef(obj: unknown): obj is ReferenceData {
	return (
		(obj as ReferenceData)?.ref_id !== undefined &&
		(obj as ReferenceData)?.ref_date !== undefined &&
		(obj as ReferenceData)?.ref_date_offset !== undefined &&
		(obj as ReferenceData)?.ref_memo !== undefined &&
		(obj as ReferenceData)?.ref_amount !== undefined &&
		(obj as ReferenceData)?.src_id !== undefined
	);
}
