import { test } from 'vitest';
import fetch from 'node-fetch';
import type { Reference } from '../../interfaces.js';

const PORT = process.env.PORT;
const idToTest = '69i8q';

async function getData(address: string) {
	const response = await fetch(address);
	const data = await response.json();
	return data;
}

test('@route GET /api/references: res formatted correctly', async () => {
	const resBody = await getData(
		`http://localhost:${PORT}/api/references/${idToTest}`,
	);

	const isObj = resBody && resBody !== undefined && typeof resBody === 'object';
	if (!isObj) throw new Error('@res.body is not an object.');

	const { references } = resBody as { references: Reference[] };

	const hasReference =
		references !== undefined && typeof references === 'object';

	if (!hasReference) throw new Error("@res.body doesn't have references key.");

	const isArray = Array.isArray(references);
	if (!isArray)
		throw new Error('@res.body @references key does not reference an array.');

	const { id, date, dateOffset, amount, memo, srcId } =
		references[0] as Reference;

	const hasId = id !== undefined && typeof id === 'string';
	const hasDate = date !== undefined && typeof date === 'string';
	const hasDateOffset =
		dateOffset !== undefined && typeof dateOffset === 'number';
	const hasAmount = amount !== undefined && typeof amount === 'number';
	const hasMemo = memo !== undefined && typeof memo === 'string';
	const hasSrcId = srcId !== undefined && typeof srcId === 'number';

	if (!hasId)
		throw new Error('@res.body @references key ref_id missing / wrong type.');
	if (!hasDate)
		throw new Error('@res.body @references key ref_date missing / wrong type.');
	if (!hasDateOffset)
		throw new Error(
			'@res.body @references key ref_date_offset missing / wrong type.',
		);
	if (!hasAmount)
		throw new Error('@res.body @references key ref_amount missing / wrong type.');
	if (!hasMemo)
		throw new Error('@res.body @references key ref_memo missing / wrong type.');
	if (!hasSrcId)
		throw new Error('@res.body @references key user_id missing / wrong type.');
});
