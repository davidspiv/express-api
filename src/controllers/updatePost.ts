import type { Request, Response, NextFunction } from 'express';
import { dbSelect, dbRunNoParams } from '../db/refDb.js';
import type { Transaction } from '../interfaces.js';

//@route PUT /api/posts/update
export default (req: Request, res: Response, next: NextFunction) => {
	const error = new Error('Request formatted incorrectly');
	if (req.body.length !== 2) return next(error);

	const currentTrans: Transaction = {
		date: req.body[0].date,
		dateOffset: req.body[0].dateOffset,
		amount: req.body[0].amount,
		memo: req.body[0].memo.replace("'", "''"),
		accId: req.body[0].accId,
		userId: req.body[0].userId.replace("'", "''"),
	};

	const post = dbSelect(currentTrans);

	if (!post.length) {
		const error = new Error('A post with those parameters was not found');
		res.status(404);
		return next(error);
	}

	const newTrans: Transaction = {
		date: req.body[1].date,
		dateOffset: req.body[1].dateOffset,
		amount: req.body[1].amount,
		memo: req.body[1].memo.replace("'", "''"),
		accId: req.body[1].accId,
		userId: req.body[1].userId.replace("'", "''"),
	};

	const { date, dateOffset, amount, memo, accId, userId } = newTrans;
	const updateStatement = `
	UPDATE transactions
	SET
		trans_date = '${date}',
		trans_date_offset = ${dateOffset},
		trans_amount = ${amount},
		trans_memo = '${memo}',
		acc_id = ${accId},
		user_id = '${userId}'
	WHERE trans_date = '${currentTrans.date}'
	AND trans_date_offset = ${currentTrans.dateOffset}
	AND acc_id = ${currentTrans.accId}
	AND user_id = '${currentTrans.userId}';
`;

	dbRunNoParams(updateStatement);

	const newPost = dbSelect(newTrans);

	res.status(200).json(newPost);
};
