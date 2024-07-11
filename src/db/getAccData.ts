import Database from "better-sqlite3";

export default () => {
  const statement = `
  SELECT acc_name, acc_initial_bal
  FROM accounts;
	`;

  const db = new Database("accounting.db", {
    fileMustExist: true,
    readonly: true,
  });
  const result = db.prepare(statement).all();
  db.close();
  return result;
};
