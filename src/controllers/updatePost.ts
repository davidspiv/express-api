import type { Request, Response, NextFunction } from 'express';
import Database from 'better-sqlite3';
import refDb from './refDb.js';

//@route PUT /api/posts/:id
export default (req: Request, res: Response, next: NextFunction) => {
	const id = Number.parseInt(req.params.id);
	const db = new Database('accounting.db', { fileMustExist: true });
	const targetTrans = () => {
		return refDb(`SELECT * FROM transactions WHERE db_id = ${id};`);
	};
	const updateRow = () => {
		db
			.prepare(`
	UPDATE transactions
	SET date_posted = '${req.body.datePosted}',
			amount = ${Number.parseFloat(req.body.amount)},
			memo = '${req.body.memo}'
	WHERE
			db_id = ${id};
	`)
			.run();
	};
	if (!targetTrans) {
		const error = new Error(`A post with the id of ${id} was not found`);
		res.status(404);
		return next(error);
	}
	updateRow();
	res.status(200).json(targetTrans()).end();
};
