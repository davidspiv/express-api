import type { Request, Response, NextFunction } from 'express';
import readManyTrans from '../../db/transaction/readMany.js';

//@route GET /api/transactions
export default (req: Request, res: Response, next: NextFunction) => {
	const limit = Number.parseInt(req.url.slice(req.url.indexOf('_limit') + 7));
	const transArr = readManyTrans(limit);
	if (transArr instanceof Error) {
		res.status(500);
		next(transArr);
		return;
	}
	const limitData = String(req.query.limit);
	if (limitData.length > 0) {
		const limit = Number.parseInt(limitData);
		if (!Number.isNaN(limit) && limit > 0) {
			return res.status(200).json(transArr.slice(0, limit));
		}
		return res.status(200).json({ transactions: transArr });
	}
	const error = new Error('Server Error');
	res.status(500);
	next(error);
};
