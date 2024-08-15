import type { Request, Response, NextFunction } from 'express';
import readRef from '../../models/reference/readOne.js';
import deleteOne from '../../models/reference/deleteOne.js';

//@route DELETE /api/references/
export default (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const ref = readRef(id);

	if (!ref) {
		const error = new Error(`A reference with id of ${id} was not found`);
		res.status(404);
		return next(error);
	}

	deleteOne(id);

	res.status(200).json(ref);
};
