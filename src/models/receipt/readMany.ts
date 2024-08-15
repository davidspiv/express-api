import Database from 'better-sqlite3';
import { Receipt } from '../../definitions/classes.js';
import type { ReceiptData } from '../../interfaces.js';

export default (timeInput = 'all', accInput = 'all', limitInput = 0) => {
	const getMostRecentDate = () => {
		const recentRefStatement = `
    SELECT ref_date
    FROM receipts
    ORDER BY ref_date
    DESC LIMIT 1;
    `;
		const db = new Database('accounting.db', {
			fileMustExist: true,
			readonly: true,
		});
		const recentRef = <[{ ref_date: string }] | null>(
			db.prepare(recentRefStatement).all()
		);
		db.close();

		return recentRef ? recentRef[0].ref_date : 'now';
	};

	const targetDate = getMostRecentDate();

	const getTimeRange = () => {
		switch (timeInput) {
			case 'day':
				return `ref_date > date('${targetDate}')`;
			case 'week':
				return `ref_date > date('${targetDate}', '-6 day')`;
			case 'month':
				return `ref_date > date('${targetDate}', '-29 day')`;
			case 'year-to-date':
				return `ref_date > date('${targetDate}', '-364 day')`;
			case 'year':
				return `ref_date > date('${targetDate}', '-364 day')`;
			default:
				return '';
		}
	};

	const getAccRange = () => {
		switch (accInput) {
			case 'asset':
				return 'acc_id < 2000';
			case 'liability':
				return 'acc_id > 2000 AND acc_id < 3000';
			case 'equity':
				return 'acc_id > 3000 AND acc_id < 4000';
			case 'revenue':
				return 'acc_id > 4000 AND acc_id < 5000';
			case 'expense':
				return 'acc_id > 5000 AND acc_id < 6000';
			default:
				return '';
		}
	};

	const getLimit = () => {
		if (limitInput) {
			return ` LIMIT ${limitInput}`;
		}
		return '';
	};

	const baseStatement = 'SELECT * FROM receipts';

	const timeRange = getTimeRange();
	const accRange = getAccRange();
	const limit = getLimit();

	const whereConnector = timeRange.length || accRange.length ? ' WHERE ' : ' ';
	const andConnector = timeRange.length && accRange.length ? ' AND ' : ' ';

	const selectStatement = baseStatement.concat(
		whereConnector,
		timeRange,
		andConnector,
		accRange,
		' ORDER BY ref_date DESC',
		limit,
		';',
	);

	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});
	const resultArr = db.prepare(selectStatement).all();
	db.close();

	const refArr: Receipt[] = [];

	for (const resultEl of resultArr) {
		if (!isRef(resultEl)) return new Error('Internal database issue');

		refArr.push(
			new Receipt(
				resultEl.ref_date,
				resultEl.ref_date_offset,
				resultEl.ref_amount,
				resultEl.ref_memo,
				resultEl.src_id,
				resultEl.is_debit,
				resultEl.ref_id,
				resultEl.ref_fitid,
			),
		);
	}

	return refArr;
};

function isRef(obj: unknown): obj is ReceiptData {
	return (
		(obj as ReceiptData)?.ref_id !== undefined &&
		(obj as ReceiptData)?.ref_date !== undefined &&
		(obj as ReceiptData)?.ref_date_offset !== undefined &&
		(obj as ReceiptData)?.ref_amount !== undefined &&
		(obj as ReceiptData)?.ref_memo !== undefined &&
		(obj as ReceiptData)?.src_id !== undefined &&
		(obj as ReceiptData)?.is_debit !== undefined
	);
}
