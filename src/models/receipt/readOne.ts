import Database from 'better-sqlite3';
import { Receipt } from '../../definitions/classes.js';
import type { ReceiptData } from '../../interfaces.js';

export default (id: string) => {
	const selectStatement = `
	SELECT *
	FROM receipts
	WHERE rcpt_id = '${id}';
	`;
	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});

	const resultArr = db.prepare(selectStatement).all();
	db.close();

	const resultEl = resultArr[0];
	const rcptArr: Receipt[] = [];

	if (!isRcpt(resultEl)) return;

	rcptArr.push(
		new Receipt(
			resultEl.rcpt_date,
			resultEl.rcpt_date_offset,
			resultEl.rcpt_amount,
			resultEl.rcpt_memo,
			resultEl.src_id,
			resultEl.is_debit,
			resultEl.rcpt_id,
			resultEl.rcpt_fitid,
		),
	);

	return rcptArr;
};

function isRcpt(obj: unknown): obj is ReceiptData {
	return (
		(obj as ReceiptData)?.rcpt_id !== undefined &&
		(obj as ReceiptData)?.rcpt_date !== undefined &&
		(obj as ReceiptData)?.rcpt_date_offset !== undefined &&
		(obj as ReceiptData)?.rcpt_amount !== undefined &&
		(obj as ReceiptData)?.rcpt_memo !== undefined &&
		(obj as ReceiptData)?.src_id !== undefined &&
		(obj as ReceiptData)?.is_debit !== undefined
	);
}
