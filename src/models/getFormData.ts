import Database from "better-sqlite3";

export default () => {
  const statement = `
  SELECT date(rcpt_date), rcpt_amount, rcpt_memo
  FROM receipts
  INNER JOIN accounts on accounts.acc_id = receipts.acc_id
  WHERE rcpt_date BETWEEN '2023-01-01' AND '2023-01-31';
	`;

  const db = new Database("accounting.db", {
    fileMustExist: true,
    readonly: true,
  });
  const result = db.prepare(statement).all();
  db.close();
  return result;
};
