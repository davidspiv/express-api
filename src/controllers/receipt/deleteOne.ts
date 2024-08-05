import type { Request, Response, NextFunction } from 'express';
import readRcpt from '../../db/receipt/readOne.js';
import deleteOne from '../../db/receipt/deleteOne.js';

//@route DELETE /api/receipts/
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const rcpt = readRcpt(id);

	if (!rcpt) {
		const error = new Error(`A receipt with id of ${id} was not found`);
		res.status(404);
		return next(error);
	}

	deleteOne(id);

	res.status(200).json(rcpt);
};
