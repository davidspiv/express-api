import Database from "better-sqlite3";
export default () => {
    const statement = `
  SELECT date(trans_date), trans_amount, trans_memo
  FROM transactions
  INNER JOIN accounts on accounts.acc_id = transactions.acc_id
  WHERE trans_date BETWEEN '2023-01-01' AND '2023-01-31';
	`;
    const db = new Database("accounting.db", {
        fileMustExist: true,
        readonly: true,
    });
    const result = db.prepare(statement).all();
    db.close();
    return result;
};
