import refDb from './refDb.js';
//@route GET /api/posts/:id
export default (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    const post = refDb(`SELECT * FROM transactions WHERE db_id = ${id}`);
    if (!post) {
        const error = new Error(`A post with the id of: ${id} was not found`);
        res.status(404);
        return next(error);
    }
    res.status(200).json(post);
};
