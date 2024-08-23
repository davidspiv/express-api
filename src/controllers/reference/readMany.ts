import type { Request, Response, NextFunction } from 'express';
import readMany from '../../models/reference/readMany.js';

//@route GET /api/references
export default (req: Request, res: Response, next: NextFunction) => {
	const parameterArr = req.url.slice(req.url.indexOf('?') + 2).split('_');
	const parameterObj: { time?: string; acc?: string; limit?: string } = {};

	parameterArr.map((el) => {
		const string = <'time' | 'acc' | 'limit'>el.slice(0, el.indexOf('='));

		parameterObj[string] = el.slice(el.indexOf('=') + 1);
	});

	const refArr = readMany(
		parameterObj.time,
		parameterObj.acc,
		parameterObj.limit ? Number.parseInt(parameterObj.limit) : 0,
	);

	if (refArr instanceof Error) {
		res.status(500);
		next(refArr);
		return;
	}

	const limitData = String(req.query.limit);

	if (limitData.length > 0) {
		const limit = Number.parseInt(limitData);

		if (!Number.isNaN(limit) && limit > 0) {
			return res.status(200).json(refArr.slice(0, limit));
		}

		return res.status(200).json({ references: refArr });
	}

	const error = new Error('Server Error');
	next(error);

	// res.status(200).json({ references: [] });
};
