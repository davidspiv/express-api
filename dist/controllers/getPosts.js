import { refDb } from '../db/refDb.js';
//@route GET /api/posts
export default (req, res, next) => {
    const limit = Number.parseInt(req.url.slice(req.url.indexOf('_limit') + 7));
    let queryString;
    if (Number.isNaN(limit)) {
        queryString = 'SELECT * FROM transactions ORDER BY trans_date DESC';
    }
    else {
        queryString = `SELECT * FROM transactions ORDER BY trans_date DESC LIMIT ${limit}`;
    }
    const posts = refDb(queryString);
    const limitData = String(req.query.limit);
    if (limitData.length > 0) {
        const limit = Number.parseInt(limitData);
        if (!Number.isNaN(limit) && limit > 0) {
            return res.status(200).json(posts.slice(0, limit));
        }
        return res.status(200).json(posts);
    }
    const error = new Error('Server Error');
    res.status(500);
    next(error);
};
