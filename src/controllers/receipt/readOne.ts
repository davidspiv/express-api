import type { Request, Response, NextFunction } from 'express';
import readOne from '../../models/receipt/readOne.js';

//@route GET /api/receipts/:id
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const rcpt = readOne(id);

	if (!rcpt) {
		const error = new Error(`A receipt with id of ${id} was not found`);
		res.status(404);
		return next(error);
	}

	res.status(200).json({ receipts: rcpt });
};
