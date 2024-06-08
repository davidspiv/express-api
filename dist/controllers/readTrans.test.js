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
    const hasId = 'trans_id' in resBody &&
        typeof resBody.trans_id === 'string';
    const hasDate = 'trans_date' in resBody &&
        typeof resBody.trans_date === 'string';
    const hasDateOffset = 'trans_date_offset' in resBody &&
        typeof resBody.trans_date_offset === 'number';
    const hasAmount = 'trans_amount' in resBody &&
        typeof resBody.trans_amount === 'number';
    const hasMemo = 'trans_memo' in resBody &&
        typeof resBody.trans_memo === 'string';
    const hasUserId = 'user_id' in resBody &&
        typeof resBody.user_id === 'string';
    const hasAccCode = 'acc_code' in resBody &&
        typeof resBody.acc_code === 'number';
    if (!hasEightKeys)
        throw new Error("@res.body doesn't have exactly 8 keys.");
    if (!hasId)
        throw new Error('@res.body trans_id missing / wrong type.');
    if (!hasDate)
        throw new Error('@res.body trans_date missing / wrong type.');
    if (!hasDateOffset)
        throw new Error('@res.body trans_date_offset missing / wrong type.');
    if (!hasAmount)
        throw new Error('@res.body trans_amount missing / wrong type.');
    if (!hasMemo)
        throw new Error('@res.body trans_memo missing / wrong type.');
    if (!hasUserId)
        throw new Error('@res.body user_id missing / wrong type.');
    if (!hasAccCode)
        throw new Error('@res.body acc_code missing / wrong type.');
});
