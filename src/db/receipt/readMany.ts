import Database from 'better-sqlite3';
import { Receipt } from '../../models/classes.js';
import type { ReceiptData } from '../../models/interfaces.js';

export default (timeInput = 'all', accInput = 'all', limitInput = 0) => {
	const getMostRecentDate = () => {
		const recentRcptStatement = `
    SELECT rcpt_date
    FROM receipts
    ORDER BY rcpt_date
    DESC LIMIT 1;
    `;
		const db = new Database('accounting.db', {
			fileMustExist: true,
			readonly: true,
		});
		const recentRcpt = <[{ rcpt_date: string }] | null>(
			db.prepare(recentRcptStatement).all()
		);
		db.close();

		return recentRcpt ? recentRcpt[0].rcpt_date : 'now';
	};

	const targetDate = getMostRecentDate();

	const getTimeRange = () => {
		switch (timeInput) {
			case 'day':
				return `rcpt_date > date('${targetDate}')`;
			case 'week':
				return `rcpt_date > date('${targetDate}', '-6 day')`;
			case 'month':
				return `rcpt_date > date('${targetDate}', '-29 day')`;
			case 'year-to-date':
				return `rcpt_date > date('${targetDate}', '-364 day')`;
			case 'year':
				return `rcpt_date > date('${targetDate}', '-364 day')`;
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
		' ORDER BY rcpt_date DESC',
		limit,
		';',
	);

	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});
	const resultArr = db.prepare(selectStatement).all();
	db.close();

	const rcptArr: Receipt[] = [];

	for (const resultEl of resultArr) {
		if (!isRcpt(resultEl)) return new Error('Internal database issue');

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
	}

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
