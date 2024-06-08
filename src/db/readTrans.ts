import Database from 'better-sqlite3';

export default(id: string) => {
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
