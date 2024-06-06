import type { Request, Response, NextFunction } from 'express';
import { dbSelect } from '../db/refDb.js';

//@route GET /api/posts
export default (req: Request, res: Response, next: NextFunction) => {
	const limit = Number.parseInt(req.url.slice(req.url.indexOf('_limit') + 7));
	let selectStatement = `
	SELECT * FROM transactions
	ORDER BY trans_date DESC;
	`;

	if (limit) {
		const semicolonIndex = selectStatement.indexOf(';');
		selectStatement = selectStatement
			.slice(0, semicolonIndex)
			.concat('', ` LIMIT ${limit};`);
	}

	const posts = dbSelect(selectStatement);
	const limitData = String(req.query.limit);
	if (limitData.length > 0) {
		const limit = Number.parseInt(limitData);
		if (!Number.isNaN(limit) && limit > 0) {
			return res.status(200).json(posts.slice(0, limit));
		}
		return res.status(200).json(posts);
	}
	const error = new Error('Server Error');
	res.status(500);
	next(error);
};
