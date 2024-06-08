import { dbSelect, dbRunNoParams } from '../db/updatePost.js';
//@route PUT /api/posts/update
export default (req, res, next) => {
    const error = new Error('Request formatted incorrectly');
    if (req.body.length !== 2)
        return next(error);
    const id = req.params.id;
    const post = dbSelect(id);
    if (!post.length) {
        const error = new Error('A post with those parameters was not found');
        res.status(404);
        return next(error);
    }
    const newTrans = {
        date: req.body[1].date,
        dateOffset: req.body[1].dateOffset,
        amount: req.body[1].amount,
        memo: req.body[1].memo.replace("'", "''"),
        accCode: req.body[1].accCode,
        userId: req.body[1].userId.replace("'", "''"),
    };
    const { date, dateOffset, amount, memo, accCode, userId } = newTrans;
    const updateStatement = `
	UPDATE transactions
	SET
		trans_date = '${date}',
		trans_date_offset = ${dateOffset},
		trans_amount = ${amount},
		trans_memo = '${memo}',
		acc_code = ${accCode},
		user_id = '${userId}'
	WHERE trans_id = '${id}';
`;
    dbRunNoParams(updateStatement);
    const newPost = dbSelect(id);
    res.status(200).json(newPost);
};
