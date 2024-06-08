import type { Request, Response, NextFunction } from 'express';
import { dbSelect, dbDeleteTrans } from '../db/deleteTrans.js';

//@route DELETE /api/transactions/
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const trans = dbSelect(id);

	if (!trans) {
		const error = new Error(`A transaction with id of ${id} was not found`);
		res.status(404);
		return next(error);
	}

	dbDeleteTrans(id);

	res.status(200).json(trans);
};
