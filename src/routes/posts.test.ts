import { expect, test } from 'vitest';
import fetch from 'node-fetch';
import type { TransactionData } from '../interfaces.js';

async function getData(address: string) {
	const response = await fetch(address);
	const data = await response.json();
	return data;
}

test('@route GET /api/posts: res formatted correctly', async () => {
	const resBody = await getData('http://localhost:5000/api/posts/');
	const isArray = Array.isArray(resBody);
	if (!isArray) throw Error('@res.body is not an array.');
	for (let i = 0; i < resBody.length; i++) {
		const hasSevenKeys = Object.keys(resBody[i]).length === 7;
		const date =
			'trans_date' in resBody[i] &&
			typeof (resBody as TransactionData[])[i].trans_date === 'string';
		const dateOffset =
			'trans_date_offset' in resBody[i] &&
			typeof (resBody as TransactionData[])[i].trans_date_offset === 'number';
		const amount =
			'trans_amount' in resBody[i] &&
			typeof (resBody as TransactionData[])[i].trans_amount === 'number';
		const memo =
			'trans_memo' in resBody[i] &&
			typeof (resBody as TransactionData[])[i].acc_id === 'number';
		const userId =
			'user_id' in resBody[i] &&
			typeof (resBody as TransactionData[])[i].user_id === 'string';

		if (!hasSevenKeys)
			throw Error(`@res.body elements @index ${i} don't have exactly 7 keys.`);
		if (!date)
			throw Error(`@res.body trans_date @index ${i} missing / wrong type.`);
		if (!dateOffset)
			throw Error(`@res.body trans_date_offset @index ${i} missing / wrong type.`);
		if (!amount)
			throw Error(`@res.body trans_amount @index ${i} missing / wrong type.`);
		if (!memo)
			throw Error(`@res.body trans_memo @index ${i} missing / wrong type.`);
		if (!userId)
			throw Error(`@res.body user_id @index ${i} missing / wrong type.`);
	}
});
