import type { Request, Response, NextFunction } from 'express';
import { dbSelect, dbDeletePost } from '../db/deletePost.js';

//@route DELETE /api/posts/
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const post = dbSelect(id);

	if (!post) {
		const error = new Error('A post with those parameters was not found');
		res.status(404);
		return next(error);
	}

	dbDeletePost(id);

	res.status(200).json(post);
};
