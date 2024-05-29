import type { Request, Response, NextFunction } from 'express';
import refDb from './refDb.js';
import Database from 'better-sqlite3';

//@route DELETE /api/posts/:id
export default (req: Request, res: Response, next: NextFunction) => {
	const id = Number.parseInt(req.params.id);
	const post = refDb(`SELECT * FROM transactions WHERE db_id = ${id}`);

	if (post.length === 0) {
		const error = new Error(`A post with the id of: ${id} was not found`);
		res.status(404);
		return next(error);
	}
	const db = new Database('accounting.db', { fileMustExist: true });
	const stmt = db.prepare(`DELETE FROM transactions WHERE db_id = ${id}`);

	stmt.run();
	res.status(200).json(post);
};
