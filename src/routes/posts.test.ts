import { expect, test } from 'vitest';
import fetch from 'node-fetch';
import type { TransactionData } from '../interfaces.js';

const res = await getData();
const verify = (value: unknown) => {
	return {
		isTruthy: !!value,
		isArray: Array.isArray(value),
		hasSevenKeys: Array.isArray(value)
			? Object.keys(value[0]).length === 7
			: false,
		hasTransDate:
			(Array.isArray(value) ? 'trans_date' in value[0] : false) &&
			typeof (value as TransactionData[])[0].trans_date_offset === 'number',
		hasTransDateOffset:
			(Array.isArray(value) ? 'trans_date_offset' in value[0] : false) &&
			typeof (value as TransactionData[])[0].trans_date_offset === 'number',
		hasTransAmount:
			(Array.isArray(value) ? 'trans_amount' in value[0] : false) &&
			typeof (value as TransactionData[])[0].trans_amount === 'number',
		hasTransMemo:
			(Array.isArray(value) ? 'trans_memo' in value[0] : false) &&
			typeof (value as TransactionData[])[0].acc_id === 'number',
		hasUserId:
			(Array.isArray(value) ? 'user_id' in value[0] : false) &&
			typeof (value as TransactionData[])[0].user_id === 'string',
	};
};

test('Req body formatted correctly', async () => {
	const {
		isTruthy,
		isArray,
		hasTransDate,
		hasTransDateOffset,
		hasTransAmount,
		hasTransMemo,
		hasUserId,
	} = verify(res);
	if (!isTruthy) throw Error('isTruthy failed');
	if (!isArray) throw Error('isArray failed');
	if (!hasTransDate) throw Error('hasTransDate failed');
	if (!hasTransDateOffset) throw Error('hasTransDateOffset failed');
	if (!hasTransAmount) throw Error('hasTransAmount failed');
	if (!hasTransMemo) throw Error('hasTransMemo failed');
	if (!hasUserId) throw Error('hasUserId failed');
	expect(
		isTruthy &&
			isArray &&
			hasTransDate &&
			hasTransDateOffset &&
			hasTransAmount &&
			hasTransMemo &&
			hasUserId,
	).toBe(true);
});

async function getData() {
	const response = await fetch('http://localhost:5000/api/posts/');
	const data = await response.json();
	return data;
}
