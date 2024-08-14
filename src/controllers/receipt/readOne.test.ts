import { test } from 'vitest';
import fetch from 'node-fetch';
import type { Receipt } from '../../types/classes.js';

const PORT = process.env.PORT;
const idToTest = '69i8q';

async function getData(address: string) {
	const response = await fetch(address);
	const data = await response.json();
	return data;
}

test('@route GET /api/receipts: res formatted correctly', async () => {
	const resBody = await getData(
		`http://localhost:${PORT}/api/receipts/${idToTest}`,
	);

	const isObj = resBody && resBody !== undefined && typeof resBody === 'object';
	if (!isObj) throw new Error('@res.body is not an object.');

	const { receipts } = resBody as { receipts: Receipt[] };

	const hasReceipt = receipts !== undefined && typeof receipts === 'object';

	if (!hasReceipt) throw new Error("@res.body doesn't have receipts key.");

	const isArray = Array.isArray(receipts);
	if (!isArray)
		throw new Error('@res.body @receipts key does not reference an array.');

	const { id, date, dateOffset, amount, memo, srcId } = receipts[0] as Receipt;

	const hasId = id !== undefined && typeof id === 'string';
	const hasDate = date !== undefined && typeof date === 'string';
	const hasDateOffset =
		dateOffset !== undefined && typeof dateOffset === 'number';
	const hasAmount = amount !== undefined && typeof amount === 'number';
	const hasMemo = memo !== undefined && typeof memo === 'string';
	const hasSrcId = srcId !== undefined && typeof srcId === 'number';

	if (!hasId)
		throw new Error('@res.body @receipts key rcpt_id missing / wrong type.');
	if (!hasDate)
		throw new Error('@res.body @receipts key rcpt_date missing / wrong type.');
	if (!hasDateOffset)
		throw new Error(
			'@res.body @receipts key rcpt_date_offset missing / wrong type.',
		);
	if (!hasAmount)
		throw new Error('@res.body @receipts key rcpt_amount missing / wrong type.');
	if (!hasMemo)
		throw new Error('@res.body @receipts key rcpt_memo missing / wrong type.');
	if (!hasSrcId)
		throw new Error('@res.body @receipts key user_id missing / wrong type.');
});
