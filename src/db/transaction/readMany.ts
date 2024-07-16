import Database from "better-sqlite3";
import { Transaction } from "../../models/classes.js";
import type { TransactionData } from "../../models/interfaces.js";

export default (limit = 0, timeRange = "week", accRange = "all") => {
  const baseStatement = `
  SELECT * FROM transactions
  ORDER BY trans_date DESC
  `;

  const timeRangeMod = () => {
    return "";
  };

  const accRangeMod = () => {
    return "";
  };

  const limitMod = (input: number) => {
    if (input) {
      return ` LIMIT ${input}`;
    }
    return "";
  };

  const selectStatement = baseStatement.concat(
    timeRangeMod(),
    accRangeMod(),
    limitMod(limit),
    ";"
  );

  const db = new Database("accounting.db", {
    fileMustExist: true,
    readonly: true,
  });
  const resultArr = db.prepare(selectStatement).all();
  db.close();

  const transArr: Transaction[] = [];

  for (const resultEl of resultArr) {
    if (!isTrans(resultEl)) return new Error("Internal database issue");

    transArr.push(
      new Transaction(
        resultEl.trans_date,
        resultEl.trans_date_offset,
        resultEl.trans_amount,
        resultEl.trans_memo,
        resultEl.acc_id,
        resultEl.is_debit,
        resultEl.trans_id,
        resultEl.trans_fitid
      )
    );
  }

  return transArr;
};

function isTrans(obj: unknown): obj is TransactionData {
  return (
    (obj as TransactionData)?.trans_id !== undefined &&
    (obj as TransactionData)?.trans_date !== undefined &&
    (obj as TransactionData)?.trans_date_offset !== undefined &&
    (obj as TransactionData)?.trans_amount !== undefined &&
    (obj as TransactionData)?.trans_memo !== undefined &&
    (obj as TransactionData)?.acc_id !== undefined &&
    (obj as TransactionData)?.is_debit !== undefined
  );
}
