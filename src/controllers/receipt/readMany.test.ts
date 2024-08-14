import { test } from 'vitest';
import fetch from 'node-fetch';
import type { Receipt } from '../../definitions/classes.js';

const PORT = process.env.PORT;

async function getData(address: string) {
	const response = await fetch(address);
	const data = await response.json();
	return data;
}

test('@route GET /api/receipts: res formatted correctly', async () => {
	const resBody = await getData(`http://localhost:${PORT}/api/receipts/`);
	const isObj = resBody && resBody !== undefined && typeof resBody === 'object';
	if (!isObj) throw new Error('@res.body is not an object.');

	const { receipts } = resBody as { receipts: Receipt[] };

	const hasReceipt = receipts !== undefined && typeof receipts === 'object';

	if (!hasReceipt) throw new Error("@res.body doesn't have receipts key.");

	const isArray = Array.isArray(receipts);
	if (!isArray)
		throw new Error('@res.body @receipts key does not reference an array.');

	for (let i = 0; i < receipts.length; i++) {
		const { id, date, dateOffset, amount, memo, srcId } = receipts[i] as Receipt;

		const hasId = id !== undefined && typeof id === 'string';
		const hasDate = date !== undefined && typeof date === 'string';
		const hasDateOffset =
			dateOffset !== undefined && typeof dateOffset === 'number';
		const hasAmount = amount !== undefined && typeof amount === 'number';
		const hasMemo = memo !== undefined && typeof memo === 'string';
		const hasUserId = srcId !== undefined && typeof srcId === 'number';

		if (!hasId)
			throw new Error(`@receipts rcpt_id @index ${i} missing / wrong type.`);
		if (!hasDate)
			throw new Error(`@receipts rcpt_date @index ${i} missing / wrong type.`);
		if (!hasDateOffset)
			throw new Error(
				`@receipts rcpt_date_offset @index ${i} missing / wrong type.`,
			);
		if (!hasAmount)
			throw new Error(`@receipts rcpt_amount @index ${i} missing / wrong type.`);
		if (!hasMemo)
			throw new Error(`@receipts rcpt_memo @index ${i} missing / wrong type.`);
		if (!hasUserId)
			throw new Error(`@receipts user_id @index ${i} missing / wrong type.`);
	}
});
