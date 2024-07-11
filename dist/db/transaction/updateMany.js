import Database from "better-sqlite3";
export default (transArr) => {
    const db = new Database("accounting.db", { fileMustExist: true });
    const updateMany = db.transaction(() => {
        for (const trans of transArr) {
            const { id, date, dateOffset, amount, memo, accId } = trans;
            const query = `
        UPDATE transactions
        SET
          trans_date = '${date}',
          trans_date_offset = ${dateOffset},
          trans_amount = ${amount},
          trans_memo = '${memo}',
          src_id = ${accId},
        WHERE trans_id = '${id}';
        `;
            const statement = db.prepare(query);
            statement.run({
                date,
                dateOffset,
                amount,
                memo,
                accId,
            });
        }
    });
    updateMany();
    db.close();
};
