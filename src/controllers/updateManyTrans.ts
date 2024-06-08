import type { Request, Response, NextFunction } from 'express';
import { dbSelect, dbUpdateAll } from '../db/updateManyTrans.js';
import type { Transaction } from '../interfaces/interfaces.js';

//@route PUT /api/transactions/update
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('transactions' in req.body))
		return next(
			Error("@res.body is not an object or doesn't have transactions key."),
		);
	const transArr = req.body.transactions;
	const isArray = Array.isArray(transArr);
	if (!isArray) return next(Error('@req.transactions is not an array.'));

	const updateArr = buildInputTransArr();
	const updateTransIdArr: string[] = [];

	if (!updateArr.length)
		return next(
			Error(
				`Input after ${updateTransIdArr[updateTransIdArr.length - 1]} failed.`,
			),
		);

	dbUpdateAll(updateArr);

	function buildInputTransArr() {
		const transArr: Transaction[] = [];

		for (let i = 0; i < transArr.length; i++) {
			const id = transArr[i].id;
			if (!id) return [];
			const exists = dbSelect(id);
			if (!exists) return [];

			const trans: Transaction = {
				date: transArr[i].date,
				dateOffset: transArr[i].dateOffset,
				amount: transArr[i].amount * 100,
				memo: transArr[i].memo.replace("'", "''"),
				accCode: transArr[i].accCode,
				userId: transArr[i].userId.replace("'", "''"),
			};
			transArr.push(trans);
			updateTransIdArr.push(id);
		}

		return transArr;
	}

	res.status(200).json({
		message: `${updateTransIdArr} updated successfully.`,
	});
};
