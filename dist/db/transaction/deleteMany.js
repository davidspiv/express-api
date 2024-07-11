import Database from 'better-sqlite3';
export default (idArr) => {
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
