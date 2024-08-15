import { test } from 'vitest';
import fetch from 'node-fetch';
import type { Reference } from '../../interfaces.js';

const PORT = process.env.PORT;

async function getData(address: string) {
	const response = await fetch(address);
	const data = await response.json();
	return data;
}

test('@route GET /api/references: res formatted correctly', async () => {
	const resBody = await getData(`http://localhost:${PORT}/api/references/`);
	const isObj = resBody && resBody !== undefined && typeof resBody === 'object';
	if (!isObj) throw new Error('@res.body is not an object.');

	const { references } = resBody as { references: Reference[] };

	const hasReference =
		references !== undefined && typeof references === 'object';

	if (!hasReference) throw new Error("@res.body doesn't have references key.");

	const isArray = Array.isArray(references);
	if (!isArray)
		throw new Error('@res.body @references key does not reference an array.');

	for (let i = 0; i < references.length; i++) {
		const { id, date, dateOffset, amount, memo, srcId } = references[
			i
		] as Reference;

		const hasId = id !== undefined && typeof id === 'string';
		const hasDate = date !== undefined && typeof date === 'string';
		const hasDateOffset =
			dateOffset !== undefined && typeof dateOffset === 'number';
		const hasAmount = amount !== undefined && typeof amount === 'number';
		const hasMemo = memo !== undefined && typeof memo === 'string';
		const hasUserId = srcId !== undefined && typeof srcId === 'number';

		if (!hasId)
			throw new Error(`@references ref_id @index ${i} missing / wrong type.`);
		if (!hasDate)
			throw new Error(`@references ref_date @index ${i} missing / wrong type.`);
		if (!hasDateOffset)
			throw new Error(
				`@references ref_date_offset @index ${i} missing / wrong type.`,
			);
		if (!hasAmount)
			throw new Error(`@references ref_amount @index ${i} missing / wrong type.`);
		if (!hasMemo)
			throw new Error(`@references ref_memo @index ${i} missing / wrong type.`);
		if (!hasUserId)
			throw new Error(`@references user_id @index ${i} missing / wrong type.`);
	}
});
