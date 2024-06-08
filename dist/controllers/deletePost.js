import { dbSelect, dbRunNoParams } from '../db/deletePost.js';
//@route DELETE /api/posts/
export default (req, res, next) => {
    const id = req.params.id;
    const post = dbSelect(id);
    if (!post) {
        const error = new Error('A post with those parameters was not found');
        res.status(404);
        return next(error);
    }
    dbRunNoParams(id);
    res.status(200).json(post);
};
