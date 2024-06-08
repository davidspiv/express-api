import type { Request, Response, NextFunction } from 'express';
import { dbSelect, dbDeleteAll } from '../db/deletePosts.js';

//@route DELETE /api/posts/
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('posts' in req.body))
		return next(Error("@res.body is not an object or doesn't have posts key."));
	const postsArr = req.body.posts;
	const isArray = Array.isArray(postsArr);
	if (!isArray) return next(Error('@posts is not an array.'));

	const deletedTransIdArr = buildDeletedTransIdArr();
	if (!deletedTransIdArr.length)
		return next(
			Error(
				`Input after ${deletedTransIdArr[deletedTransIdArr.length - 1]} failed.`,
			),
		);

	dbDeleteAll(deletedTransIdArr);

	function buildDeletedTransIdArr() {
		const idArr: string[] = [];

		for (let i = 0; i < postsArr.length; i++) {
			const id = postsArr[i].id;
			const exists = dbSelect(id);
			if (!exists) return [];
			
			idArr.push(id);
		}

		return idArr;
	}

	res.status(200).json({
		message: `${deletedTransIdArr} deleted successfully.`,
	});
};
