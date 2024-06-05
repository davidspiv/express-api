import type { Request, Response, NextFunction } from 'express';
import Database from 'better-sqlite3';
import { refDb } from '../db/refDb.js';
import type { Transaction } from '../interfaces.js';

//@route PUT /api/posts/update
export default (req: Request, res: Response, next: NextFunction) => {
	const error = new Error('Request formatted incorrectly');
	if (req.body.length !== 2) return next(error);

	const currDate = req.body[0].date;
	const currDateOffset = req.body[0].dateOffset;
	const currAccId = req.body[0].accId;
	const currUserId = req.body[0].userId;

	const post = refDb(`
	SELECT *
	FROM transactions
	WHERE trans_date = '${currDate}'
	AND trans_date_offset = '${currDateOffset}'
	AND acc_id = '${currAccId}'
	AND user_id = '${currUserId}';
	`);

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
	const db = new Database('accounting.db', { fileMustExist: true });
	const query = db.prepare(`
		UPDATE transactions
		SET
			trans_date = '${date}',
			trans_date_offset = ${dateOffset},
			trans_amount = ${amount},
			trans_memo = '${memo}',
			acc_id = ${accId},
			user_id = '${userId}'
		WHERE trans_date = '${currDate}'
		AND trans_date_offset = ${currDateOffset}
		AND acc_id = ${currAccId}
		AND user_id = '${currUserId}';
		`);

	query.run();

	const newPost = refDb(`
		SELECT *
		FROM transactions
		WHERE trans_date = '${date}'
		AND trans_date_offset = '${dateOffset}'
		AND acc_id = '${accId}'
		AND user_id = '${userId}';
		`);

	db.close();
	res.status(200).json(newPost);
};
