import { readLatest, addMany } from '../../models/reference/addMany.js';
import type { Request, Response, NextFunction } from 'express';
import type { Reference, ReferenceData } from '../../interfaces.js';
const { randomUUID } = await import('node:crypto');

//@route POST /api/references/
export default (req: Request, res: Response, next: NextFunction) => {
	if (typeof req.body !== 'object' || !req.body || !('references' in req.body))
		return next(
			new Error("@res.body is not an object or doesn't have references key."),
		);
	const refArr = req.body.references;
	const isArray = Array.isArray(refArr);

	if (!isArray) return next(new Error('@req.references is not an array.'));

	const recentDbRef = <ReferenceData | null>(
		readLatest(req.body.references[0].srcId)[0]
	);

	const unseededError = new Error('Database unseeded');
	if (!recentDbRef) return next(unseededError);

	const inputRefArr = buildInputRefArr();
	sortRefDataArr();
	const sliceIndex = getSliceIndex(recentDbRef);

	function buildInputRefArr() {
		const arr: Reference[] = [];

		for (let i = 0; i < refArr.length; i++) {
			//move data creation to model
			const id = randomUUID();
			const [date, dateOffset, amount, memo, srcId, accCode] = refArr[i];
			const ref = {
				id,
				date,
				dateOffset,
				amount,
				memo,
				srcId,
				accCode,
			};
			arr.push(ref);
		}
		return arr;
	}

	//use query to return sorted data
	function sortRefDataArr() {
		const filterDate = (date: string) => {
			return new Date(Number.parseInt(date)).getTime();
		};
		inputRefArr.sort(
			(a: Reference, b: Reference) => filterDate(b.date) - filterDate(a.date),
		);
	}

	function getSliceIndex(recentDbRef: ReferenceData) {
		const id = recentDbRef.ref_id;
		if (!id) return 0;
		for (let i = 0; i < inputRefArr.length; i++) {
			if (inputRefArr[i].id === id) return i;
		}
		return inputRefArr.length;
	}

	const noNewRefError = new Error('No new references to input');
	if (!sliceIndex) return next(noNewRefError);

	const filteredRefArr = inputRefArr.slice(0, sliceIndex);
	addMany(filteredRefArr);
	res.status(200).json(filteredRefArr);
};
