import type { Request, Response, NextFunction } from 'express';
import { dbSelect, dbAdd } from '../db/refDb.js';
import type { Transaction } from '../interfaces.js';

//@route POST /api/posts/insert
export default (req: Request, res: Response, next: NextFunction) => {
	const trans: Transaction = {
		date: req.body.date,
		dateOffset: req.body.dateOffset,
		amount: req.body.amount,
		memo: req.body.memo.replace("'", "''"),
		accId: req.body.accId,
		userId: req.body.userId.replace("'", "''"),
	};

	const { date, dateOffset, accId, userId } = trans;

	const selectStatement = `
	SELECT *
	FROM transactions
	WHERE trans_date = '${date}'
	AND trans_date_offset = '${dateOffset}'
	AND acc_id = '${accId}'
	AND user_id = '${userId}';
	`;

	const post = dbSelect(selectStatement);

	if (post.length) {
		const error = new Error('A post with those parameters was already found');
		res.status(404);
		return next(error);
	}

	const insertStatement = `
	INSERT INTO
		transactions (trans_date, trans_date_offset, trans_amount, trans_memo, acc_id, user_id)
	VALUES
		(@date, @dateOffset, @amount, @memo, @accId, @userId);
	`;

	dbAdd(insertStatement, trans);
	const newPost = dbSelect(selectStatement);
	res.status(200).json(newPost);
};
