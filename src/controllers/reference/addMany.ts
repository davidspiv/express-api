import {
	getSourceId,
	removeDuplicateRefs,
	insertRefs,
} from '../../models/reference/addMany.js';

import type { Request, Response, NextFunction } from 'express';

//@route POST /api/references/
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('references' in req.body)) {
		return next(
			new Error("[REQUEST BODY] Not an object or doesn't have references key."),
		);
	}

	const refArr = req.body.references;
	const isArray = Array.isArray(refArr);

	if (!isArray) {
		return next(new Error('[REQUEST BODY] References value is not an array.'));
	}

	const sourceId = getSourceId();
	const newRefs = removeDuplicateRefs(sourceId, refArr);

	if (!newRefs.length) {
		return res.status(200).json('No new references to input');
	}

	try {
		const refIds = insertRefs(sourceId, newRefs);

		res.status(200).json({ refIds });
	} catch (error) {
		const errorMessage = (error as { message: string })?.message;
		next(new Error(`[DATABASE] ${errorMessage || 'Unknown'}`));
	}
};
