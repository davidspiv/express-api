import type { Request, Response, NextFunction } from 'express';
import { dbSelect, dbRunNoParams } from '../db/refDb.js';

//@route DELETE /api/posts/
export default (req: Request, res: Response, next: NextFunction) => {
	const date = req.body.date;
	const dateOffset = req.body.dateOffset;
	const accId = req.body.accId;
	const userId = req.body.userId;

	const post = dbSelect(`
	SELECT *
	FROM transactions
	WHERE trans_date = '${date}'
	AND trans_date_offset = '${dateOffset}'
	AND acc_id = '${accId}'
	AND user_id = '${userId}';
	`);

	if (!post) {
		const error = new Error('A post with those parameters was not found');
		res.status(404);
		return next(error);
	}

	dbRunNoParams(`
	DELETE FROM transactions
	WHERE trans_date = '${date}'
	AND trans_date_offset = '${dateOffset}'
	AND acc_id = '${accId}'
	AND user_id = '${userId}';
	`);

	res.status(200).json(post);
};
