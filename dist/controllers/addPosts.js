import { dbSelect, dbAddAll } from '../db/refDb.js';
//@route POST /api/posts/
export default (req, res, next) => {
    const requestError = new Error('Request formatted incorrectly');
    if (!req.body.length)
        return next(requestError);
    const recentDbTrans = dbSelect(`
		SELECT *
		FROM transactions
		WHERE acc_code = ${req.body[0].accCode}
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
                amount: Number.parseFloat(req.body[i].amount) * 100,
                memo: req.body[i].memo.replace("'", "''"),
                accCode: req.body[i].accCode,
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
    function getSliceIndex(recentDbTrans) {
        const { trans_date, trans_date_offset, acc_code, user_id } = recentDbTrans;
        if (!trans_date)
            return 0;
        for (let i = 0; i < inputTransArr.length; i++) {
            if (inputTransArr[i].date === trans_date &&
                inputTransArr[i].dateOffset === trans_date_offset &&
                inputTransArr[i].accCode === acc_code &&
                inputTransArr[i].userId === user_id)
                return i;
        }
        return inputTransArr.length;
    }
    const noNewTransError = new Error('No new transactions to input');
    if (!sliceIndex)
        return next(noNewTransError);
    const filteredTransArr = inputTransArr.slice(0, sliceIndex);
    const insertStatement = `
	INSERT INTO transactions
		(trans_date, trans_date_offset, trans_amount, trans_memo, acc_code, user_id)
	VALUES
		(@date, @dateOffset, @amount, @memo, @accCode, @userId);
	`;
    dbAddAll(insertStatement, filteredTransArr);
    res.status(200).json(filteredTransArr);
};
