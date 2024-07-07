import Database from "better-sqlite3";
import type { Transaction } from "../models/classes.js";

const readLatestTrans = (srcId: number) => {
  const selectStatement = `
		SELECT *
		FROM transactions
		WHERE src_id = '${srcId}'
		ORDER BY trans_date
		DESC LIMIT 1;
		`;
  const db = new Database("accounting.db", {
    fileMustExist: true,
    readonly: true,
  });
  const result = db.prepare(selectStatement).all();
  db.close();
  return result;
};

const addManyTrans = (transArr: Transaction[]) => {
  const db = new Database("accounting.db", { fileMustExist: true });
  const query = `
	INSERT INTO
		transactions (trans_id, trans_date, trans_date_offset, trans_amount, trans_memo, src_id)
	VALUES
		(@id, @date, @dateOffset, @amount, @memo, @srcId);
	`;
  const statement = db.prepare(query);
  const insertMany = db.transaction((transArr) => {
    for (const trans of transArr) {
      statement.run({ ...trans });
    }
  });
  insertMany(transArr);
  db.close();
};

export { readLatestTrans, addManyTrans };
