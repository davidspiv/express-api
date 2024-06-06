import { expect, test } from 'vitest';
import fetch from 'node-fetch';
test('Req body formatted correctly', async () => {
    const res = await testRoute();
    const isTransactionArr = (value) => !!value &&
        typeof value === 'object' &&
        typeof value[0].trans_date === 'string' &&
        typeof value[0].trans_date_offset === 'number' &&
        typeof value[0].trans_amount === 'number' &&
        typeof value[0].trans_memo === 'string' &&
        typeof value[0].acc_id === 'number' &&
        typeof value[0].user_id === 'string';
    expect(isTransactionArr(res)).toBe(true);
});
async function testRoute() {
    const response = await fetch('http://localhost:5000/api/posts/');
    const data = await response.json();
    return data;
}
