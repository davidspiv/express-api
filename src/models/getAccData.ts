import Database from 'better-sqlite3';

export default () => {
	const statement = `
  SELECT acc_name, SUM(rcpt_amount) AS acc_total
  FROM receipt
  INNER JOIN accounts on accounts.acc_id = receipt.acc_id
  WHERE rcpt_date BETWEEN '2023-01-01' AND '2023-01-31'
  GROUP BY acc_code
	`;

	const db = new Database('accounting.db', {
		fileMustExist: true,
		readonly: true,
	});
	const result = db.prepare(statement).all();
	db.close();
	return result;
};
