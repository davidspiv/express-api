import type { Request, Response, NextFunction } from 'express';
import { createId } from '../dev/utils.js';
import { dbSelectSomeTrans, dbAddAllTrans } from '../db/addManyTrans.js';
import type { Transaction, TransactionData } from '../interfaces/interfaces.js';

//@route POST /api/transactions/
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('transactions' in req.body))
		return next( new Error("@res.body is not an object or doesn't have transactions key."));
	const transArr = req.body.transactions;
	const isArray = Array.isArray(transArr);
	if (!isArray) return next( new Error('@req.transactions is not an array.'));

	const recentDbTrans = <TransactionData | null>(
		dbSelectSomeTrans(
			req.body.transactions[0].userId,
			req.body.transactions[0].accCode,
		)[0]
	);

	const unseededError = new Error('Database unseeded');
	if (!recentDbTrans) return next(unseededError);

	const inputTransArr = buildInputTransArr();
	sortTransDataArr();
	const sliceIndex = getSliceIndex(recentDbTrans);

	function buildInputTransArr() {
		const arr: Transaction[] = [];

		for (let i = 0; i < transArr.length; i++) {
			const trans: Transaction = {
				date: transArr[i].date,
				dateOffset: transArr[i].dateOffset,
				amount: Number.parseFloat(transArr[i].amount) * 100,
				memo: transArr[i].memo.replace("'", "''"),
				accCode: transArr[i].accCode,
				userId: transArr[i].userId.replace("'", "''"),
			};
			arr.push(trans);
		}

		return arr;
	}

	function sortTransDataArr() {
		const filterDate = (date: string) => {
			return new Date(Number.parseInt(date)).getTime();
		};
		inputTransArr.sort(
			(a: Transaction, b: Transaction) => filterDate(b.date) - filterDate(a.date),
		);
	}

	function getSliceIndex(recentDbTrans: TransactionData) {
		const { trans_id } = recentDbTrans;
		if (!trans_id) return 0;
		for (let i = 0; i < inputTransArr.length; i++) {
			const id = createId(
				inputTransArr[i].date,
				inputTransArr[i].dateOffset,
				inputTransArr[i].accCode,
				inputTransArr[i].userId,
			);
			inputTransArr[i].id = id;
			if (id === trans_id) return i;
		}
		return inputTransArr.length;
	}

	const noNewTransError = new Error('No new transactions to input');
	if (!sliceIndex) return next(noNewTransError);

	const filteredTransArr = inputTransArr.slice(0, sliceIndex);
	dbAddAllTrans(filteredTransArr);
	res.status(200).json(filteredTransArr);
};
