import Database from 'better-sqlite3';

const dbSelect = (id: string) => {
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

const dbRunNoParams = (id: string) => {
	const query = `
	DELETE FROM transactions
	WHERE trans_id = '${id}';
	`;
	const db = new Database('accounting.db', { fileMustExist: true });
	db.prepare(query).run();
	db.close();
};

export { dbSelect, dbRunNoParams };
