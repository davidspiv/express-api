import { test } from 'vitest';
import fetch from 'node-fetch';
import type { TransactionData } from '../interfaces/interfaces.js';

async function getData(address: string) {
	const response = await fetch(address);
	const data = await response.json();
	return data;
}

test('@route GET /api/transactions: res formatted correctly', async () => {
	const resBody = await getData('http://localhost:5000/api/transactions/');
	if (typeof resBody !== 'object' || !resBody || !('transactions' in resBody))
		return new Error(
			"@res.body is not an object or doesn't have transactions key.",
		);
	const transArr = resBody.transactions;
	const isArray = Array.isArray(transArr);
	if (!isArray) return new Error('@req.transactions is not an array.');

	for (let i = 0; i < transArr.length; i++) {
		const hasEightKeys = Object.keys(transArr[i]).length === 8;
		const hasId =
			'trans_id' in transArr[i] &&
			typeof (transArr as TransactionData[])[i].trans_id === 'string';
		const hasDate =
			'trans_date' in transArr[i] &&
			typeof (transArr as TransactionData[])[i].trans_date === 'string';
		const hasDateOffset =
			'trans_date_offset' in transArr[i] &&
			typeof (transArr as TransactionData[])[i].trans_date_offset === 'number';
		const hasAmount =
			'trans_amount' in transArr[i] &&
			typeof (transArr as TransactionData[])[i].trans_amount === 'number';
		const hasMemo =
			'trans_memo' in transArr[i] &&
			typeof (transArr as TransactionData[])[i].trans_memo === 'string';
		const hasUserId =
			'user_id' in transArr[i] &&
			typeof (transArr as TransactionData[])[i].user_id === 'string';
		const hasAccCode =
			'acc_code' in transArr[i] &&
			typeof (transArr as TransactionData[])[i].acc_code === 'number';

		if (!hasEightKeys)
			throw new Error(
				`@transactions elements @index ${i} don't have exactly 8 keys.`,
			);
		if (!hasId)
			throw new Error(`@transactions trans_id @index ${i} missing / wrong type.`);
		if (!hasDate)
			throw new Error(
				`@transactions trans_date @index ${i} missing / wrong type.`,
			);
		if (!hasDateOffset)
			throw new Error(
				`@transactions trans_date_offset @index ${i} missing / wrong type.`,
			);
		if (!hasAmount)
			throw new Error(
				`@transactions trans_amount @index ${i} missing / wrong type.`,
			);
		if (!hasMemo)
			throw new Error(
				`@transactions trans_memo @index ${i} missing / wrong type.`,
			);
		if (!hasUserId)
			throw new Error(`@transactions user_id @index ${i} missing / wrong type.`);
		if (!hasAccCode)
			throw new Error(`@transactions acc_code @index ${i} missing / wrong type.`);
	}
});
