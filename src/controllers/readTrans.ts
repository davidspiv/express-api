import type { Request, Response, NextFunction } from 'express';
import readTrans from '../db/readTrans.js';

//@route GET /api/transactions/:id
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const trans = readTrans(id);

	if (!trans) {
		const error = new Error(`A transaction with id of ${id} was not found`);
		res.status(404);
		return next(error);
	}

	res.status(200).json({ transactions: trans });
};
