import { insertModels } from '../../dev/utilDb.js';
import dynamicQueries from '../../dev/dynamicQueries.js';
import Database from 'better-sqlite3';

import type { Request, Response, NextFunction } from 'express';
import type { ReferenceData } from '../../interfaces.js';
import { addMany } from '../../models/reference/addMany.js';

const getSourceId = () => {
	const selectStatement = `
		SELECT *
		FROM sources;
		`;

	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});

	const result = <ReferenceData[]>db.prepare(selectStatement).all();

	db.close();
	return result[0].src_id;
};

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
