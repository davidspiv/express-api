import Database from 'better-sqlite3';
import { Transaction } from '../models/classes.js';
import type { TransactionData } from '../models/interfaces.js';

export default (id: string) => {
	const selectStatement = `
	SELECT *
	FROM transactions
	WHERE trans_id = '${id}';
	`;
	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});

	const resultArr = db.prepare(selectStatement).all();
	db.close();

	const resultEl = resultArr[0];
	const transArr: Transaction[] = [];

	if (!isTrans(resultEl)) return;

	transArr.push(
		new Transaction(
			resultEl.trans_date,
			resultEl.trans_date_offset,
			resultEl.trans_amount,
			resultEl.trans_memo,
			resultEl.src_id,
			resultEl.trans_id,
			resultEl.trans_fitid
		),
	);

	return transArr;
};

function isTrans(obj: unknown): obj is TransactionData {
	return (
    (obj as TransactionData)?.trans_id !== undefined &&
    (obj as TransactionData)?.trans_date !== undefined &&
    (obj as TransactionData)?.trans_date_offset !== undefined &&
    (obj as TransactionData)?.trans_amount !== undefined &&
    (obj as TransactionData)?.trans_memo !== undefined &&
    (obj as TransactionData)?.src_id !== undefined
	);
}
