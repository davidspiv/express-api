import Database from "better-sqlite3";
export default (transArr) => {
    const db = new Database("accounting.db", { fileMustExist: true });
    const updateMany = db.transaction(() => {
        for (const trans of transArr) {
            const { id, date, dateOffset, amount, memo, srcId } = trans;
            const query = `
			UPDATE transactions
			SET
				trans_date = '${date}',
				trans_date_offset = ${dateOffset},
				trans_amount = ${amount},
				trans_memo = '${memo}',
				src_id = ${srcId},
			WHERE trans_id = '${id}';
			`;
            const statement = db.prepare(query);
            statement.run({
                date,
                dateOffset,
                amount,
                memo,
                srcId,
            });
        }
    });
    updateMany();
    db.close();
};
