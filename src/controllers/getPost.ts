import type { Request, Response, NextFunction } from 'express';
import { dbSelect } from '../db/refDb.js';
import type { Transaction } from '../interfaces.js';

//@route GET /api/posts/search
export default (req: Request, res: Response, next: NextFunction) => {
	const trans: Transaction = {
		date: req.body.date,
		dateOffset: req.body.dateOffset,
		amount: req.body.amount,
		memo: req.body.memo.replace("'", "''"),
		accId: req.body.accId,
		userId: req.body.userId.replace("'", "''"),
	};

	const post = dbSelect(trans);

	if (!post) {
		const error = new Error('A post with those parameters was not found');
		res.status(404);
		return next(error);
	}

	res.status(200).json(post);
};
