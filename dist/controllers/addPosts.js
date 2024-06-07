import { createId } from '../db/utils.js';
import { dbSelectSome, dbAddAll } from '../db/refDb.js';
//@route POST /api/posts/
export default (req, res, next) => {
    if (typeof req.body !== 'object' || !req.body || !('posts' in req.body))
        throw Error("@res.body is not an object or doesn't have posts key.");
    const postsArr = req.body.posts;
    const isArray = Array.isArray(postsArr);
    if (!isArray)
        throw Error('@posts is not an array.');
    const recentDbTrans = (dbSelectSome(req.body.posts[0].userId, req.body.posts[0].accCode)[0]);
    const unseededError = new Error('Database unseeded');
    if (!recentDbTrans)
        return next(unseededError);
    const inputTransArr = buildInputTransArr();
    sortTransDataArr();
    const sliceIndex = getSliceIndex(recentDbTrans);
    function buildInputTransArr() {
        const arr = [];
        for (let i = 0; i < postsArr.length; i++) {
            const trans = {
                date: postsArr[i].date,
                dateOffset: postsArr[i].dateOffset,
                amount: Number.parseFloat(postsArr[i].amount) * 100,
                memo: postsArr[i].memo.replace("'", "''"),
                accCode: postsArr[i].accCode,
                userId: postsArr[i].userId.replace("'", "''"),
            };
            arr.push(trans);
        }
        return arr;
    }
    function sortTransDataArr() {
        const filterDate = (date) => {
            return new Date(Number.parseInt(date)).getTime();
        };
        inputTransArr.sort((a, b) => filterDate(b.date) - filterDate(a.date));
    }
    function getSliceIndex(recentDbTrans) {
        const { trans_id } = recentDbTrans;
        if (!trans_id)
            return 0;
        for (let i = 0; i < inputTransArr.length; i++) {
            const id = createId(inputTransArr[i].date, inputTransArr[i].dateOffset, inputTransArr[i].accCode, inputTransArr[i].userId);
            inputTransArr[i].id = id;
            if (id === trans_id)
                return i;
        }
        return inputTransArr.length;
    }
    const noNewTransError = new Error('No new transactions to input');
    if (!sliceIndex)
        return next(noNewTransError);
    const filteredTransArr = inputTransArr.slice(0, sliceIndex);
    const insertStatement = `
	INSERT INTO
		transactions (trans_id, trans_date, trans_date_offset, trans_amount, trans_memo, acc_code, user_id)
	VALUES
		(@id, @date, @dateOffset, @amount, @memo, @accCode, @userId);
	`;
    dbAddAll(insertStatement, filteredTransArr);
    res.status(200).json(filteredTransArr);
};
