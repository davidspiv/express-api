import { refDb } from '../db/refDb.js';
import Database from 'better-sqlite3';
//@route DELETE /api/posts/
export default (req, res, next) => {
    const date = req.body.date;
    const dateOffset = req.body.dateOffset;
    const accId = req.body.accId;
    const userId = req.body.userId;
    const post = refDb(`
	SELECT *
	FROM transactions
	WHERE trans_date = '${date}'
	AND trans_date_offset = '${dateOffset}'
	AND acc_id = '${accId}'
	AND user_id = '${userId}';
	`);
    console.log(posts);
    if (!posts.length) {
        const error = new Error('A post with those parameters was not found');
        res.status(404);
        return next(error);
    }
    const db = new Database('accounting.db', { fileMustExist: true });
    const query = db.prepare(`
	DELETE FROM transactions
	WHERE trans_date_offset = ${dateOffset};
	`);
    query.run();
    db.close();
    res.status(200).json(posts);
};
