import { addMany } from '../../models/reference/addMany.js';
import type { Request, Response, NextFunction } from 'express';
import type { Reference, ReferenceData } from '../../interfaces.js';
const { randomUUID } = await import('node:crypto');

import { insertModels } from '../../dev/utilDb.js';
import dynamicQueries from '../../dev/dynamicQueries.js';

//@route POST /api/references/
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('references' in req.body))
		return next(
			new Error("@res.body is not an object or doesn't have references key."),
		);
	const refArr = req.body.references;
	const isArray = Array.isArray(refArr);

	if (!isArray) return next(new Error('@req.references is not an array.'));

	const message = addMany(refArr);
	res.status(200).json(message);
};
