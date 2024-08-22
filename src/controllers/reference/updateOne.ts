import readOne from '../../models/reference/readOne.js';
import updateOne from '../../models/reference/updateOne.js';

import type { Request, Response, NextFunction } from 'express';
import type { Reference } from '../../models/reference/00_interfaces.js';

//@route PUT /api/references/update
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const post = readOne(id);

	if (!post) {
		const error = new Error('A post with those parameters was not found');
		res.status(404);
		return next(error);
	}

	const [date, dateOffset, amount, memo, srcId] = req.body;

	const newRef: Reference = {
		id,
		date,
		dateOffset,
		amount,
		memo,
		srcId,
	};

	updateOne(newRef);

	const newPost = readOne(id);

	res.status(200).json(newPost);
};
