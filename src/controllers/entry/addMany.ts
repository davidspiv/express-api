import { insertEntries } from '../../models/entry/addMany.js';

import type { Request, Response, NextFunction } from 'express';

const isError = (body: { entries: object[] }) => {
	if (typeof body !== 'object') {
		return '[REQUEST BODY] Not an object.';
	}

	if (!body?.entries) {
		return "[REQUEST BODY] Doesn't have entries key.";
	}

	if (!Array.isArray(body?.entries)) {
		return '[REQUEST BODY] Entries value is not an array.';
	}

	return null;
};

//@route POST /api/entries
export default (req: Request, res: Response, next: NextFunction) => {
	const { body } = req;
	const errorMessage = isError(body);

	if (errorMessage) {
		return next(new Error(errorMessage));
	}

	const entries = req.body.entries;

	try {
		const entryIds = insertEntries(entries);

		res.status(200).json({ entryIds });
	} catch (error) {
		const errorMessage = (error as { message: string })?.message;
		next(new Error(`[DATABASE] ${errorMessage || 'Unknown'}`));
	}
};
