import type { Request, Response, NextFunction } from 'express';
import readRcpt from '../../models/receipt/readOne.js';
import updateMany from '../../models/receipt/updateMany.js';
import { Receipt } from '../../definitions/classes.js';

//@route PUT /api/receipts/update
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('receipts' in req.body))
		return next(
			Error("@res.body is not an object or doesn't have receipts key."),
		);
	const rcptArr = req.body.receipts;
	const isArray = Array.isArray(rcptArr);
	if (!isArray) return next(Error('@req.receipts is not an array.'));

	const updateArr = buildInputRcptArr();
	const updateRcptIdArr: string[] = [];

	if (!updateArr.length)
		return next(
			Error(`Input after ${updateRcptIdArr[updateRcptIdArr.length - 1]} failed.`),
		);

	updateMany(updateArr);

	function buildInputRcptArr() {
		const rcptArr: Receipt[] = [];

		for (let i = 0; i < rcptArr.length; i++) {
			const id = rcptArr[i].id;
			if (!id) return [];
			const exists = readRcpt(id);
			if (!exists) return [];

			const rcpt = new Receipt(
				id,
				req.body.date,
				req.body.dateOffset,
				req.body.amount,
				req.body.memo,
				req.body.accCode,
				req.body.userId,
			);
			rcptArr.push(rcpt);
			updateRcptIdArr.push(id);
		}

		return rcptArr;
	}

	res.status(200).json({
		message: `${updateRcptIdArr} updated successfully.`,
	});
};
