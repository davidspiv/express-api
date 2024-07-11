import readTrans from "../../db/transaction/readOne.js";
import deleteTrans from "../../db/transaction/deleteOne.js";
//@route DELETE /api/transactions/
export default (req, res, next) => {
    const id = req.params.id;
    const trans = readTrans(id);
    if (!trans) {
        const error = new Error(`A transaction with id of ${id} was not found`);
        res.status(404);
        return next(error);
    }
    deleteTrans(id);
    res.status(200).json(trans);
};
