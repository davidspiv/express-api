import Database from 'better-sqlite3';

export default () => {
	const statement = `
  SELECT acc_name, SUM(trans_amount) AS acc_total
  FROM transactions
  INNER JOIN accounts on accounts.acc_id = transactions.acc_id
  WHERE trans_date BETWEEN '2023-01-01' AND '2023-01-31'
  AND acc_code = 1001;
	`;

	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});
	const result = db.prepare(statement).all();
	db.close();
	return result;
};
