import Database from 'better-sqlite3';
import { Transaction } from '../models/classes.js';
import type { TransactionData } from '../models/interfaces.js';

export default (limit = 0) => {
	let selectStatement = `
	SELECT * FROM transactions
	ORDER BY trans_date DESC;
	`;

	if (limit) {
		const semicolonIndex = selectStatement.indexOf(';');
		selectStatement = selectStatement
			.slice(0, semicolonIndex)
			.concat('', ` LIMIT ${limit};`);
	}
	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});
	const resultArr = db.prepare(selectStatement).all();
	db.close();

	const transArr: Transaction[] = [];

	for (const resultEl of resultArr) {
		if (!isTrans(resultEl)) return new Error('Internal database issue');

		transArr.push(
			new Transaction(
				resultEl.trans_date,
				resultEl.trans_date_offset,
				resultEl.trans_amount,
				resultEl.trans_memo,
				resultEl.user_id,
				resultEl.acc_code,
				resultEl.trans_id,
				resultEl.trans_fitid,
			),
		);
	}

	return transArr;
};

function isTrans(obj: unknown): obj is TransactionData {
	return (
		(obj as TransactionData)?.trans_id !== undefined &&
		(obj as TransactionData)?.trans_date !== undefined &&
		(obj as TransactionData)?.trans_date_offset !== undefined &&
		(obj as TransactionData)?.trans_amount !== undefined &&
		(obj as TransactionData)?.trans_memo !== undefined &&
		(obj as TransactionData)?.user_id !== undefined &&
		(obj as TransactionData)?.acc_code !== undefined &&
		(obj as TransactionData)?.trans_fitid !== undefined
	);
}
