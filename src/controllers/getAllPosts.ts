import type { Request, Response, NextFunction } from 'express';
import refDb from './refDb.js';
import url from 'node:url';

//@route GET /api/posts
export default (req: Request, res: Response, next: NextFunction) => {
	const limit = Number.parseInt(req.url.slice(req.url.indexOf('_limit') + 7));
	let queryString: string;
	if (Number.isNaN(limit)) {
		queryString = 'SELECT * FROM transactions';
	} else {
		queryString = `SELECT * FROM transactions LIMIT ${limit}`;
	}
	const posts = refDb(queryString);
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
