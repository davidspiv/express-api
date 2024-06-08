import Database from 'better-sqlite3';
const dbSelect = (id) => {
    const selectStatement = `
	SELECT *
	FROM transactions
	WHERE trans_id = '${id}';
	`;
    const db = new Database('accounting.db', {
        fileMustExist: true,
        readonly: true,
    });
    const result = db.prepare(selectStatement).all();
    db.close();
    return result;
};
const dbDeleteAll = (idArr) => {
    const db = new Database('accounting.db', { fileMustExist: true });
    const updateMany = db.transaction(() => {
        for (const id of idArr) {
            const query = `
			DELETE FROM transactions
			WHERE trans_id = '${id}';
			`;
            const statement = db.prepare(query);
            statement.run(id);
        }
    });
    updateMany();
    db.close();
};
export { dbSelect, dbDeleteAll };
