import type { Request, Response, NextFunction } from 'express';
import readRcpt from '../../models/receipt/readOne.js';
import deleteMany from '../../models/receipt/deleteMany.js';

//@route DELETE /api/receipts/
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('receipts' in req.body))
		return next(
			new Error("@res.body is not an object or doesn't have receipts key."),
		);
	const rcptArr = req.body.receipts;
	const isArray = Array.isArray(rcptArr);
	if (!isArray) return next(new Error('@req.receipts is not an array.'));

	const deletedRcptIdArr = buildDeletedRcptIdArr();

	if (!deletedRcptIdArr.length)
		return next(
			Error(
				`Input after ${deletedRcptIdArr[deletedRcptIdArr.length - 1]} failed.`,
			),
		);

	deleteMany(deletedRcptIdArr);

	function buildDeletedRcptIdArr() {
		const idArr: string[] = [];

		for (let i = 0; i < rcptArr.length; i++) {
			const id = rcptArr[i].id;
			const exists = readRcpt(id);
			if (!exists) return [];

			idArr.push(id);
		}

		return idArr;
	}

	res.status(200).json({
		message: `${deletedRcptIdArr} deleted successfully.`,
	});
};
