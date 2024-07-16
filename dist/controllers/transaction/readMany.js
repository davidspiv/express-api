import readMany from "../../db/transaction/readMany.js";
//@route GET /api/transactions
export default (req, res, next) => {
    const limit = Number.parseInt(req.url.slice(req.url.indexOf("_limit") + "_limit=".length));
    const timeRange = req.url.slice(req.url.indexOf("_time") + "_time=".length, req.url.indexOf("_acc"));
    const accRange = req.url.slice(req.url.indexOf("_acc") + "_acc=".length, req.url.indexOf("_limit"));
    const transArr = readMany(timeRange, accRange, limit);
    if (transArr instanceof Error) {
        res.status(500);
        next(transArr);
        return;
    }
    // console.log(timeRange, accRange, limit);
    const limitData = String(req.query.limit);
    if (limitData.length > 0) {
        const limit = Number.parseInt(limitData);
        if (!Number.isNaN(limit) && limit > 0) {
            return res.status(200).json(transArr.slice(0, limit));
        }
        return res.status(200).json({ transactions: transArr });
    }
    const error = new Error("Server Error");
    res.status(500);
    next(error);
};
