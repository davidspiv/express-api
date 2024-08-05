import Database from 'better-sqlite3';

export default(idArr: string[]) => {
	const db = new Database('accounting.db', { fileMustExist: true });

	const updateMany = db.transaction(() => {
		for (const id of idArr) {
			const query = `
			DELETE FROM receipts
			WHERE rcpt_id = '${id}';
			`;

			const statement = db.prepare(query);

			statement.run(id);
		}
	});

	updateMany();
	db.close();
};
