import Database from 'better-sqlite3';

import type { Reference, Reference_Data } from '../../types.js';

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

function isRef(obj: unknown): obj is Reference_Data {
	return (
		(obj as Reference_Data)?.ref_id !== undefined &&
		(obj as Reference_Data)?.ref_date !== undefined &&
		(obj as Reference_Data)?.ref_date_offset !== undefined &&
		(obj as Reference_Data)?.ref_memo !== undefined &&
		(obj as Reference_Data)?.ref_amount !== undefined &&
		(obj as Reference_Data)?.src_id !== undefined
	);
}
