import { dbSelect, dbRunNoParams } from '../db/refDb.js';
//@route DELETE /api/posts/
export default (req, res, next) => {
    const trans = {
        date: req.body.date,
        dateOffset: req.body.dateOffset,
        amount: req.body.amount,
        memo: req.body.memo.replace("'", "''"),
        accId: req.body.accId,
        userId: req.body.userId.replace("'", "''"),
    };
    const post = dbSelect(trans);
    if (!post) {
        const error = new Error('A post with those parameters was not found');
        res.status(404);
        return next(error);
    }
    dbRunNoParams(`
	DELETE FROM transactions
	WHERE trans_date = '${trans.date}'
	AND trans_date_offset = '${trans.dateOffset}'
	AND acc_id = '${trans.accId}'
	AND user_id = '${trans.userId}';
	`);
    res.status(200).json(post);
};
