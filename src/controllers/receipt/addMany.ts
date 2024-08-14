import type { Request, Response, NextFunction } from 'express';
import { readLatest, addMany } from '../../db/receipt/addMany.js';
import { Receipt } from '../../models/classes.js';
import type { ReceiptData } from '../../models/interfaces.js';

//@route POST /api/receipts/
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('receipts' in req.body))
		return next(
			new Error("@res.body is not an object or doesn't have receipts key."),
		);
	const rcptArr = req.body.receipts;
	const isArray = Array.isArray(rcptArr);

	if (!isArray) return next(new Error('@req.receipts is not an array.'));

	const recentDbRcpt = <ReceiptData | null>(
		readLatest(req.body.receipts[0].srcId)[0]
	);

	const unseededError = new Error('Database unseeded');
	if (!recentDbRcpt) return next(unseededError);

	const inputRcptArr = buildInputRcptArr();
	sortRcptDataArr();
	const sliceIndex = getSliceIndex(recentDbRcpt);

	function buildInputRcptArr() {
		const arr: Receipt[] = [];

		for (let i = 0; i < rcptArr.length; i++) {
			const rcpt = new Receipt(
				rcptArr[i].date,
				rcptArr[i].dateOffset,
				rcptArr[i].amount,
				rcptArr[i].memo,
				rcptArr[i].userId,
				rcptArr[i].accCode,
			);
			arr.push(rcpt);
		}
		return arr;
	}

	function sortRcptDataArr() {
		const filterDate = (date: string) => {
			return new Date(Number.parseInt(date)).getTime();
		};
		inputRcptArr.sort(
			(a: Receipt, b: Receipt) => filterDate(b.date) - filterDate(a.date),
		);
	}

	function getSliceIndex(recentDbRcpt: ReceiptData) {
		const id = recentDbRcpt.rcpt_id;
		if (!id) return 0;
		for (let i = 0; i < inputRcptArr.length; i++) {
			if (inputRcptArr[i].id === id) return i;
		}
		return inputRcptArr.length;
	}

	const noNewRcptError = new Error('No new receipts to input');
	if (!sliceIndex) return next(noNewRcptError);

	const filteredRcptArr = inputRcptArr.slice(0, sliceIndex);
	addMany(filteredRcptArr);
	res.status(200).json(filteredRcptArr);
};
