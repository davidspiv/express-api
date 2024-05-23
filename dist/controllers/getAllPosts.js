import refDb from './refDb.js';
//@route GET /api/posts
export default (req, res, next) => {
    const posts = refDb('SELECT * FROM transactions');
    // for (const post of posts) {
    // 	post.trans_description = post.trans_description
    // 		.replace(/[^A-Za-z ]/g, '')
    // 		.replace(/ +/g, ' ');
    // }
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
