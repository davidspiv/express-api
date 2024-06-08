import { dbSelect, dbUpdate } from '../db/updateTrans.js';
//@route PUT /api/transactions/update
export default (req, res, next) => {
    const id = req.params.id;
    const post = dbSelect(id);
    if (!post.length) {
        const error = new Error('A post with those parameters was not found');
        res.status(404);
        return next(error);
    }
    const newTrans = {
        id,
        date: req.body.date,
        dateOffset: req.body.dateOffset,
        amount: req.body.amount,
        memo: req.body.memo.replace("'", "''"),
        accCode: req.body.accCode,
        userId: req.body.userId.replace("'", "''"),
    };
    dbUpdate(newTrans);
    const newPost = dbSelect(id);
    res.status(200).json(newPost);
};
