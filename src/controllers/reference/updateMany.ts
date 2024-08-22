import readRef from '../../models/reference/readOne.js';
import updateMany from '../../models/reference/updateMany.js';

import type { Request, Response, NextFunction } from 'express';
import type { Reference } from '../../models/reference/00_interfaces.js';

//@route PUT /api/references/update
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('references' in req.body))
		return next(
			Error("@res.body is not an object or doesn't have references key."),
		);
	const refArr = req.body.references;
	const isArray = Array.isArray(refArr);
	if (!isArray) return next(Error('@req.references is not an array.'));

	const updateArr = buildInputRefArr();
	const updateRefIdArr: string[] = [];

	if (!updateArr.length)
		return next(
			Error(`Input after ${updateRefIdArr[updateRefIdArr.length - 1]} failed.`),
		);

	updateMany(updateArr);

	function buildInputRefArr() {
		const refArr: Reference[] = [];

		for (let i = 0; i < refArr.length; i++) {
			const id = refArr[i].id;
			if (!id) return [];
			const exists = readRef(id);
			if (!exists) return [];

			const [date, dateOffset, amount, memo, srcId, accCode] = req.body;

			const ref: Reference = {
				id,
				date,
				dateOffset,
				amount,
				memo,
				srcId,
			};
			refArr.push(ref);
			updateRefIdArr.push(id);
		}

		return refArr;
	}

	res.status(200).json({
		message: `${updateRefIdArr} updated successfully.`,
	});
};
