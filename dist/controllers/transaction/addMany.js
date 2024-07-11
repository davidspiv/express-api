import { readLatestTrans, addManyTrans, } from "../../db/transaction/addMany.js";
import { Transaction } from "../../models/classes.js";
//@route POST /api/transactions/
export default (req, res, next) => {
    if (typeof req.body !== "object" ||
        !req.body ||
        !("transactions" in req.body))
        return next(new Error("@res.body is not an object or doesn't have transactions key."));
    const transArr = req.body.transactions;
    const isArray = Array.isArray(transArr);
    if (!isArray)
        return next(new Error("@req.transactions is not an array."));
    const recentDbTrans = (readLatestTrans(req.body.transactions[0].srcId)[0]);
    const unseededError = new Error("Database unseeded");
    if (!recentDbTrans)
        return next(unseededError);
    const inputTransArr = buildInputTransArr();
    sortTransDataArr();
    const sliceIndex = getSliceIndex(recentDbTrans);
    function buildInputTransArr() {
        const arr = [];
        for (let i = 0; i < transArr.length; i++) {
            const trans = new Transaction(transArr[i].date, transArr[i].dateOffset, transArr[i].amount, transArr[i].memo, transArr[i].userId, transArr[i].accCode);
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
        const id = recentDbTrans.trans_id;
        if (!id)
            return 0;
        for (let i = 0; i < inputTransArr.length; i++) {
            if (inputTransArr[i].id === id)
                return i;
        }
        return inputTransArr.length;
    }
    const noNewTransError = new Error("No new transactions to input");
    if (!sliceIndex)
        return next(noNewTransError);
    const filteredTransArr = inputTransArr.slice(0, sliceIndex);
    addManyTrans(filteredTransArr);
    res.status(200).json(filteredTransArr);
};
