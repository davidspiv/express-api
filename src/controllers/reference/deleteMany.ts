import type { Request, Response, NextFunction } from 'express';
import readRef from '../../models/reference/readOne.js';
import deleteMany from '../../models/reference/deleteMany.js';

//@route DELETE /api/references/
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('references' in req.body))
		return next(
			new Error("@res.body is not an object or doesn't have references key."),
		);
	const refArr = req.body.references;
	const isArray = Array.isArray(refArr);
	if (!isArray) return next(new Error('@req.references is not an array.'));

	const deletedRefIdArr = buildDeletedRefIdArr();

	if (!deletedRefIdArr.length)
		return next(
			Error(`Input after ${deletedRefIdArr[deletedRefIdArr.length - 1]} failed.`),
		);

	deleteMany(deletedRefIdArr);

	function buildDeletedRefIdArr() {
		const idArr: string[] = [];

		for (let i = 0; i < refArr.length; i++) {
			const id = refArr[i].id;
			const exists = readRef(id);
			if (!exists) return [];

			idArr.push(id);
		}

		return idArr;
	}

	res.status(200).json({
		message: `${deletedRefIdArr} deleted successfully.`,
	});
};
