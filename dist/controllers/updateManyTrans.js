import readTrans from '../db/readTrans.js';
import updateManyTrans from '../db/updateManyTrans.js';
import { Transaction } from '../models/classes.js';
//@route PUT /api/transactions/update
export default (req, res, next) => {
    if (typeof req.body !== 'object' || !req.body || !('transactions' in req.body))
        return next(Error("@res.body is not an object or doesn't have transactions key."));
    const transArr = req.body.transactions;
    const isArray = Array.isArray(transArr);
    if (!isArray)
        return next(Error('@req.transactions is not an array.'));
    const updateArr = buildInputTransArr();
    const updateTransIdArr = [];
    if (!updateArr.length)
        return next(Error(`Input after ${updateTransIdArr[updateTransIdArr.length - 1]} failed.`));
    updateManyTrans(updateArr);
    function buildInputTransArr() {
        const transArr = [];
        for (let i = 0; i < transArr.length; i++) {
            const id = transArr[i].id;
            if (!id)
                return [];
            const exists = readTrans(id);
            if (!exists)
                return [];
            const trans = new Transaction(id, req.body.date, req.body.dateOffset, req.body.amount, req.body.memo, req.body.accCode, req.body.userId);
            transArr.push(trans);
            updateTransIdArr.push(id);
        }
        return transArr;
    }
    res.status(200).json({
        message: `${updateTransIdArr} updated successfully.`,
    });
};
