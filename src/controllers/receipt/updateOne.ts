import type { Request, Response, NextFunction } from 'express';
import readOne from '../../models/receipt/readOne.js';
import updateOne from '../../models/receipt/updateOne.js';
import { Receipt } from '../../definitions/classes.js';

//@route PUT /api/receipts/update
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const post = readOne(id);

	if (!post) {
		const error = new Error('A post with those parameters was not found');
		res.status(404);
		return next(error);
	}

	const newRcpt = new Receipt(
		id,
		req.body.date,
		req.body.dateOffset,
		req.body.amount,
		req.body.memo,
		req.body.accCode,
		req.body.userId,
	);

	updateOne(newRcpt);

	const newPost = readOne(id);

	res.status(200).json(newPost);
};
