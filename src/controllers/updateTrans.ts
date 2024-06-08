import type { Request, Response, NextFunction } from 'express';
import readTrans from '../db/readTrans.js';
import updateTrans  from '../db/updateTrans.js';
import type { Transaction } from '../interfaces/interfaces.js';

//@route PUT /api/transactions/update
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const post = readTrans(id);

	if (!post.length) {
		const error = new Error('A post with those parameters was not found');
		res.status(404);
		return next(error);
	}

	const newTrans: Transaction = {
		id,
		date: req.body.date,
		dateOffset: req.body.dateOffset,
		amount: req.body.amount,
		memo: req.body.memo.replace("'", "''"),
		accCode: req.body.accCode,
		userId: req.body.userId.replace("'", "''"),
	};

	updateTrans(newTrans);

	const newPost = readTrans(id);

	res.status(200).json(newPost);
};
