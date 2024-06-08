import readTrans from '../db/readTrans.js';
import deleteManyTrans from '../db/deleteManyTrans.js';
//@route DELETE /api/transactions/
export default (req, res, next) => {
    if (typeof req.body !== 'object' || !req.body || !('transactions' in req.body))
        return next(new Error("@res.body is not an object or doesn't have transactions key."));
    const transArr = req.body.transactions;
    const isArray = Array.isArray(transArr);
    if (!isArray)
        return next(new Error('@req.transactions is not an array.'));
    const deletedTransIdArr = buildDeletedTransIdArr();
    if (!deletedTransIdArr.length)
        return next(Error(`Input after ${deletedTransIdArr[deletedTransIdArr.length - 1]} failed.`));
    deleteManyTrans(deletedTransIdArr);
    function buildDeletedTransIdArr() {
        const idArr = [];
        for (let i = 0; i < transArr.length; i++) {
            const id = transArr[i].id;
            const exists = readTrans(id);
            if (!exists)
                return [];
            idArr.push(id);
        }
        return idArr;
    }
    res.status(200).json({
        message: `${deletedTransIdArr} deleted successfully.`,
    });
};
