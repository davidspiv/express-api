import readOne from "../../db/transaction/readOne.js";
import updateOne from "../../db/transaction/updateOne.js";
import { Transaction } from "../../models/classes.js";
//@route PUT /api/transactions/update
export default (req, res, next) => {
    const id = req.params.id;
    const post = readOne(id);
    if (!post) {
        const error = new Error("A post with those parameters was not found");
        res.status(404);
        return next(error);
    }
    const newTrans = new Transaction(id, req.body.date, req.body.dateOffset, req.body.amount, req.body.memo, req.body.accCode, req.body.userId);
    updateOne(newTrans);
    const newPost = readOne(id);
    res.status(200).json(newPost);
};
