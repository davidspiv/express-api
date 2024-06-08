import { test } from 'vitest';
import fetch from 'node-fetch';
const idToTest = '2ddkljdDavid';
async function getData(address) {
    const response = await fetch(address);
    const data = await response.json();
    return data;
}
test('@route GET /api/transactions: res formatted correctly', async () => {
    const resBody = await getData(`http://localhost:5000/api/transactions/${idToTest}`);
    if (typeof resBody !== 'object' || !resBody)
        return new Error('@res.body is not an object.');
    const hasEightKeys = Object.keys(resBody).length === 8;
    const isId = 'trans_id' in resBody &&
        typeof resBody.trans_id === 'string';
    const isDate = 'trans_date' in resBody &&
        typeof resBody.trans_date === 'string';
    const isDateOffset = 'trans_date_offset' in resBody &&
        typeof resBody.trans_date_offset === 'number';
    const isAmount = 'trans_amount' in resBody &&
        typeof resBody.trans_amount === 'number';
    const isMemo = 'trans_memo' in resBody &&
        typeof resBody.trans_memo === 'string';
    const isUserId = 'user_id' in resBody &&
        typeof resBody.user_id === 'string';
    const isAccCode = 'acc_code' in resBody &&
        typeof resBody.acc_code === 'number';
    if (!hasEightKeys)
        throw new Error("@transactions elements don't have exactly 8 keys.");
    if (!isId)
        throw new Error('@transactions trans_id missing / wrong type.');
    if (!isDate)
        throw new Error('@transactions trans_date missing / wrong type.');
    if (!isDateOffset)
        throw new Error('@transactions trans_date_offset missing / wrong type.');
    if (!isAmount)
        throw new Error('@transactions trans_amount missing / wrong type.');
    if (!isMemo)
        throw new Error('@transactions trans_memo missing / wrong type.');
    if (!isUserId)
        throw new Error('@transactions user_id missing / wrong type.');
    if (!isAccCode)
        throw new Error('@transactions acc_code missing / wrong type.');
});
