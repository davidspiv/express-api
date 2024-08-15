import Database from 'better-sqlite3';

export default (id: string) => {
	const query = `
	DELETE FROM refs
	WHERE ref_id = '${id}';
	`;
	const db = new Database('accounting.db', { fileMustExist: true });
	db.prepare(query).run();
	db.close();
};

