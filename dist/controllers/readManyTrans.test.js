import { test } from 'vitest';
import fetch from 'node-fetch';
const PORT = process.env.PORT;
async function getData(address) {
    const response = await fetch(address);
    const data = await response.json();
    return data;
}
test('@route GET /api/transactions: res formatted correctly', async () => {
    const resBody = await getData(`http://localhost:${PORT}/api/transactions/`);
    const isObj = resBody && resBody !== undefined && typeof resBody === 'object';
    if (!isObj)
        throw new Error('@res.body is not an object.');
    const { transactions } = resBody;
    const hasTransaction = transactions !== undefined && typeof transactions === 'object';
    if (!hasTransaction)
        throw new Error("@res.body doesn't have transactions key.");
    const isArray = Array.isArray(transactions);
    if (!isArray)
        throw new Error('@res.body @transactions key does not reference an array.');
    for (let i = 0; i < transactions.length; i++) {
        const { id, date, dateOffset, amount, memo, userId, accCode } = transactions[i];
        const hasEightKeys = Object.keys(transactions[i]).length === 8;
        const hasId = id !== undefined && typeof id === 'string';
        const hasDate = date !== undefined && typeof date === 'string';
        const hasDateOffset = dateOffset !== undefined && typeof dateOffset === 'number';
        const hasAmount = amount !== undefined && typeof amount === 'number';
        const hasMemo = memo !== undefined && typeof memo === 'string';
        const hasUserId = userId !== undefined && typeof userId === 'string';
        const hasAccCode = accCode !== undefined && typeof accCode === 'number';
        if (!hasEightKeys)
            throw new Error(`@transactions elements @index ${i} don't have exactly 8 keys.`);
        if (!hasId)
            throw new Error(`@transactions trans_id @index ${i} missing / wrong type.`);
        if (!hasDate)
            throw new Error(`@transactions trans_date @index ${i} missing / wrong type.`);
        if (!hasDateOffset)
            throw new Error(`@transactions trans_date_offset @index ${i} missing / wrong type.`);
        if (!hasAmount)
            throw new Error(`@transactions trans_amount @index ${i} missing / wrong type.`);
        if (!hasMemo)
            throw new Error(`@transactions trans_memo @index ${i} missing / wrong type.`);
        if (!hasUserId)
            throw new Error(`@transactions user_id @index ${i} missing / wrong type.`);
        if (!hasAccCode)
            throw new Error(`@transactions acc_code @index ${i} missing / wrong type.`);
    }
});
