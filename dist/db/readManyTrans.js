import Database from 'better-sqlite3';
export default (limit = 0) => {
    let selectStatement = `
	SELECT * FROM transactions
	ORDER BY trans_date DESC;
	`;
    if (limit) {
        const semicolonIndex = selectStatement.indexOf(';');
        selectStatement = selectStatement
            .slice(0, semicolonIndex)
            .concat('', ` LIMIT ${limit};`);
    }
    const db = new Database('accounting.db', {
        fileMustExist: true,
        readonly: true,
    });
    const result = db.prepare(selectStatement).all();
    db.close();
    return result;
};
