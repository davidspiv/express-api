import { test } from 'vitest';
import fetch from 'node-fetch';
import type { Transaction } from '../models/classes.js';

const PORT = process.env.PORT;
const idToTest = '2ddkljdDavid';

async function getData(address: string) {
	const response = await fetch(address);
	const data = await response.json();
	return data;
}

test('@route GET /api/transactions: res formatted correctly', async () => {
	const resBody = await getData(
		`http://localhost:${PORT}/api/transactions/${idToTest}`,
	);

	const isObj = resBody && resBody !== undefined && typeof resBody === 'object';
	if (!isObj) throw new Error('@res.body is not an object.');

	const { transactions } = resBody as { transactions: Transaction[] };

	const hasTransaction =
		transactions !== undefined && typeof transactions === 'object';

	if (!hasTransaction)
		throw new Error("@res.body doesn't have transactions key.");

	const isArray = Array.isArray(transactions);
	if (!isArray)
		throw new Error('@res.body @transactions key does not reference an array.');

	const { id, date, dateOffset, amount, memo, userId, accCode } =
		transactions[0] as Transaction;

	const hasEightKeys = Object.keys(transactions[0]).length === 8;
	const hasId = id !== undefined && typeof id === 'string';
	const hasDate = date !== undefined && typeof date === 'string';
	const hasDateOffset =
		dateOffset !== undefined && typeof dateOffset === 'number';
	const hasAmount = amount !== undefined && typeof amount === 'number';
	const hasMemo = memo !== undefined && typeof memo === 'string';
	const hasUserId = userId !== undefined && typeof userId === 'string';
	const hasAccCode = accCode !== undefined && typeof accCode === 'number';

	if (!hasEightKeys)
		throw new Error("@res.body @transactions key doesn't have exactly 8 keys.");
	if (!hasId)
		throw new Error('@res.body @transactions key trans_id missing / wrong type.');
	if (!hasDate)
		throw new Error(
			'@res.body @transactions key trans_date missing / wrong type.',
		);
	if (!hasDateOffset)
		throw new Error(
			'@res.body @transactions key trans_date_offset missing / wrong type.',
		);
	if (!hasAmount)
		throw new Error(
			'@res.body @transactions key trans_amount missing / wrong type.',
		);
	if (!hasMemo)
		throw new Error(
			'@res.body @transactions key trans_memo missing / wrong type.',
		);
	if (!hasUserId)
		throw new Error('@res.body @transactions key user_id missing / wrong type.');
	if (!hasAccCode)
		throw new Error('@res.body @transactions key acc_code missing / wrong type.');
});
