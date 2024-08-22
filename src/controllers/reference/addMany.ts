import {
	getSourceId,
	removeDuplicateRefs,
	insertRefs,
} from '../../models/reference/addMany.js';

import type { Request, Response, NextFunction } from 'express';

const isError = (body: { references: object[] }) => {
	if (typeof body !== 'object') {
		return '[REQUEST BODY ERR] Not an object.';
	}

	if (!body?.references) {
		return "[REQUEST BODY ERR] Doesn't have references key.";
	}

	if (!Array.isArray(body?.references)) {
		return '[REQUEST BODY ERR] References value is not an array.';
	}

	return null;
};

//@route POST /api/references/
export default (req: Request, res: Response, next: NextFunction) => {
	const { body } = req;
	const errorMessage = isError(body);

	if (errorMessage) {
		return next(new Error(errorMessage));
	}

	const refArr = body.references;
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
		next(new Error(`[DATABASE ERR] ${errorMessage || 'Unknown'}`));
	}
};
