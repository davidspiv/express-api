import Database from 'better-sqlite3';
//@route POST /api/posts/
export default (req, res, next) => {
    console.log(req.body);
    const db = new Database('accounting.db', { fileMustExist: true });
    const stmt = db.prepare('INSERT INTO transactions (trans_type, date_posted, amount, memo, fitid) VALUES (@transType, @datePosted, @amount, @memo, @fitid)');
    const insertData = db.transaction(() => {
        for (let i = 0; i < req.body.length; i++) {
            const transaction = req.body[i];
            stmt.run({
                transType: transaction.transType,
                datePosted: transaction.datePosted,
                amount: transaction.amount,
                memo: transaction.memo,
                fitid: null,
            });
        }
    });
    insertData();
    db.close();
    res.status(201);
    res.end();
};
