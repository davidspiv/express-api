import { dbSelect, dbUpdateAll } from '../db/updatePosts.js';
//@route PUT /api/posts/update
export default (req, res, next) => {
    if (typeof req.body !== 'object' || !req.body || !('posts' in req.body))
        return next(Error("@res.body is not an object or doesn't have posts key."));
    const postsArr = req.body.posts;
    const isArray = Array.isArray(postsArr);
    if (!isArray)
        return next(Error('@posts is not an array.'));
    const updatedTransIdArr = [];
    const transArr = buildInputTransArr();
    if (!transArr.length)
        return next(Error(`Input after ${updatedTransIdArr[updatedTransIdArr.length - 1]} failed.`));
    dbUpdateAll(transArr);
    function buildInputTransArr() {
        const transArr = [];
        for (let i = 0; i < postsArr.length; i++) {
            const id = postsArr[i].id;
            const exists = dbSelect(id);
            if (!exists)
                return [];
            const trans = {
                date: postsArr[i].date,
                dateOffset: postsArr[i].dateOffset,
                amount: Number.parseFloat(postsArr[i].amount) * 100,
                memo: postsArr[i].memo.replace("'", "''"),
                accCode: postsArr[i].accCode,
                userId: postsArr[i].userId.replace("'", "''"),
            };
            transArr.push(trans);
            updatedTransIdArr.push(id);
        }
        return transArr;
    }
    res.status(200).json({
        message: `${updatedTransIdArr} updated successfully.`,
    });
};
