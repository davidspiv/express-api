import { refDb } from '../db/refDb.js';
import Database from 'better-sqlite3';
//@route POST /api/posts/
export default (req, res, next) => {
    const filterDate = (date) => {
        return new Date(Number.parseInt(date)).getTime();
    };
    const db = new Database('accounting.db', { fileMustExist: true });
    const transArr = req.body.sort((a, b) => filterDate(b.datePosted) - filterDate(a.datePosted));
    const recentDbTrans = refDb('SELECT * FROM transactions ORDER BY trans_date DESC LIMIT 1;')[0];
    const query = db.prepare('INSERT INTO transactions (trans_type, date_posted, amount, memo, fitid) VALUES (@transType, @datePosted, @amount, @memo, @fitid);');
    const search = (arr, targetTrans = {}) => {
        if (!targetTrans.date_posted || !targetTrans.amount || !targetTrans.memo)
            return -1;
        const date = targetTrans.date_posted;
        const amount = targetTrans.amount;
        const memo = targetTrans.memo;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].datePosted === date &&
                arr[i].amount === amount &&
                arr[i].memo === memo) {
                return i;
            }
        }
        return arr.length;
    };
    let updatedTransIndex = -1;
    if (typeof recentDbTrans === 'object' && recentDbTrans !== null) {
        updatedTransIndex = search(transArr, recentDbTrans);
    }
    if (updatedTransIndex === 0) {
        res.status(201).json({ message: 'Transactions already exist in db' }).end();
        return;
    }
    if (updatedTransIndex === -1) {
        const error = new Error('No transactions in database?');
        res.status(500);
        return next(error);
    }
    const insertData = db.transaction(() => {
        for (let i = 0; i < updatedTransIndex; i++) {
            const transaction = transArr[i];
            query.run({
                transType: transaction.transType,
                datePosted: transaction.datePosted,
                amount: transaction.amount,
                memo: transaction.memo,
                fitid: null,
            });
        }
    });
    insertData();
    db.close();
    res
        .status(201)
        .json({
        message: `Inserted ${updatedTransIndex} transactions into the database`,
    })
        .end();
};
