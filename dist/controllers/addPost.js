import { createId } from '../db/utils.js';
import { dbSelect, dbAdd } from '../db/refDb.js';
//@route POST /api/posts/
export default (req, res, next) => {
    const trans = {
        id: createId(req.body.date, req.body.dateOffset, req.body.accCode, req.body.userId),
        date: req.body.date,
        dateOffset: req.body.dateOffset,
        amount: req.body.amount,
        memo: req.body.memo.replace("'", "''"),
        accCode: req.body.accCode,
        userId: req.body.userId.replace("'", "''"),
    };
    if (!trans.id) {
        const error = new Error('ID missing');
        res.status(404);
        return next(error);
    }
    const post = dbSelect(trans.id);
    if (post.length) {
        const error = new Error('A post with those parameters was already found');
        res.status(404);
        return next(error);
    }
    const insertStatement = `
	INSERT INTO
		transactions (trans_id, trans_date, trans_date_offset, trans_amount, trans_memo, acc_code, user_id)
	VALUES
		(@id, @date, @dateOffset, @amount, @memo, @accCode, @userId);
	`;
    dbAdd(insertStatement, trans);
    const newPost = dbSelect(trans.id);
    res.status(200).json(newPost);
};
