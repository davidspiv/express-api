import { test } from 'vitest';
import fetch from 'node-fetch';
async function getData(address) {
    const response = await fetch(address);
    const data = await response.json();
    return data;
}
test('@route GET /api/posts: res formatted correctly', async () => {
    const resBody = await getData('http://localhost:5000/api/posts/');
    if (typeof resBody !== 'object' || !resBody || !('posts' in resBody))
        throw Error("@res.body is not an object or doesn't have posts key.");
    const postsArr = resBody.posts;
    const isArray = Array.isArray(postsArr);
    if (!isArray)
        throw Error('@posts is not an array.');
    for (let i = 0; i < postsArr.length; i++) {
        const hasEightKeys = Object.keys(postsArr[i]).length === 8;
        const isId = 'trans_id' in postsArr[i] &&
            typeof postsArr[i].trans_id === 'string';
        const isDate = 'trans_date' in postsArr[i] &&
            typeof postsArr[i].trans_date === 'string';
        const isDateOffset = 'trans_date_offset' in postsArr[i] &&
            typeof postsArr[i].trans_date_offset === 'number';
        const isAmount = 'trans_amount' in postsArr[i] &&
            typeof postsArr[i].trans_amount === 'number';
        const isMemo = 'trans_memo' in postsArr[i] &&
            typeof postsArr[i].trans_memo === 'string';
        const isUserId = 'user_id' in postsArr[i] &&
            typeof postsArr[i].user_id === 'string';
        const isAccCode = 'acc_code' in postsArr[i] &&
            typeof postsArr[i].acc_code === 'number';
        if (!hasEightKeys)
            throw Error(`@posts elements @index ${i} don't have exactly 7 keys.`);
        if (!isId)
            throw Error(`@posts trans_id @index ${i} missing / wrong type.`);
        if (!isDate)
            throw Error(`@posts trans_date @index ${i} missing / wrong type.`);
        if (!isDateOffset)
            throw Error(`@posts trans_date_offset @index ${i} missing / wrong type.`);
        if (!isAmount)
            throw Error(`@posts trans_amount @index ${i} missing / wrong type.`);
        if (!isMemo)
            throw Error(`@posts trans_memo @index ${i} missing / wrong type.`);
        if (!isUserId)
            throw Error(`@posts user_id @index ${i} missing / wrong type.`);
        if (!isAccCode)
            throw Error(`@posts acc_code @index ${i} missing / wrong type.`);
    }
});
