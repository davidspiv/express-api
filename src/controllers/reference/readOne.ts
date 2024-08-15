import type { Request, Response, NextFunction } from 'express';
import readOne from '../../models/reference/readOne.js';

//@route GET /api/references/:id
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const ref = readOne(id);

	if (!ref) {
		const error = new Error(`A reference with id of ${id} was not found`);
		res.status(404);
		return next(error);
	}

	res.status(200).json({ references: ref });
};
