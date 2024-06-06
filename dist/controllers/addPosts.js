import { refDb } from '../db/refDb.js';
//@route POST /api/posts/
export default (req, res, next) => {
    const requestError = new Error('Request formatted incorrectly');
    if (!req.body.length)
        return next(requestError);
    const recentDbTrans = refDb(`
		SELECT *
		FROM transactions
		WHERE acc_id = ${req.body[0].accId}
		AND user_id = '${req.body[0].userId}'
		ORDER BY trans_date
		DESC LIMIT 1;
		`)[0];
    const unseededError = new Error('Database unseeded');
    if (!recentDbTrans)
        return next(unseededError);
    const inputTransArr = buildInputTransArr();
    sortTransDataArr();
    const sliceIndex = getSliceIndex(recentDbTrans);
    function buildInputTransArr() {
        const arr = [];
        for (let i = 0; i < req.body.length; i++) {
            const trans = {
                date: req.body[i].date,
                dateOffset: req.body[i].dateOffset,
                amount: req.body[i].amount,
                memo: req.body[i].memo.replace("'", "''"),
                accId: req.body[i].accId,
                userId: req.body[i].userId.replace("'", "''"),
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
    function getSliceIndex({ trans_date, trans_date_offset, acc_id, user_id, }) {
        if (!trans_date)
            return 0;
        for (let i = 0; i < inputTransArr.length; i++) {
            if (inputTransArr[i].date === trans_date &&
                inputTransArr[i].dateOffset === trans_date_offset &&
                inputTransArr[i].accId === acc_id &&
                inputTransArr[i].userId === user_id)
                return i - 1;
        }
        return inputTransArr.length;
    }
    const noNewTransError = new Error('No new transactions to input');
    if (!sliceIndex)
        return next(noNewTransError);
    res.status(200).json(inputTransArr.slice(0, sliceIndex));
};
