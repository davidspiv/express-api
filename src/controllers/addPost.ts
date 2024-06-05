import type { Request, Response, NextFunction } from 'express';
import { refDb } from '../db/refDb.js';
import Database from 'better-sqlite3';
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

	const post = refDb(`
	SELECT *
	FROM transactions
	WHERE trans_date = '${date}'
	AND trans_date_offset = '${dateOffset}'
	AND acc_id = '${accId}'
	AND user_id = '${userId}';
	`);

	if (post.length) {
		const error = new Error('A post with those parameters was already found');
		res.status(404);
		return next(error);
	}

	const db = new Database('accounting.db', { fileMustExist: true });
	const query = db.prepare(`
	INSERT INTO
		transactions (trans_date, trans_date_offset, trans_amount, trans_memo, acc_id, user_id)
	VALUES
		(@date, @dateOffset, @amount, @memo, @accId, @userId);
		`);

	query.run(trans);

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
