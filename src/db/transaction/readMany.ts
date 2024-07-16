import Database from "better-sqlite3";
import { Transaction } from "../../models/classes.js";
import type { TransactionData } from "../../models/interfaces.js";

export default (limit = 0, timeRange = "all", accRange = "all") => {
  const baseStatement = `
  SELECT * FROM transactions
  `;

  const timeRangeMod = () => {
    switch (timeRange) {
      case "day":
        return `trans_date > date('now', '-1 day')`;
      case "week":
        return `trans_date > date('now', '-7 day')`;
      case "month":
        return `trans_date > date('now', '-30 day')`;
      case "year-to-date":
        return `trans_date > date('now', '-365 day')`;
      case "year":
        return `trans_date > date('now', '-365 day')`;
      default:
        return "";
    }
  };

  const accRangeMod = () => {
    switch (accRange) {
      case "asset":
        return "acc_id < 2000";
      case "liability":
        return "acc_id < 3000";
      case "equity":
        return "acc_id < 4000";
      case "revenue":
        return "acc_id < 5000";
      case "expense":
        return "acc_id < 6000";
      default:
        return "";
    }
  };

  const limitMod = () => {
    if (limit) {
      return ` LIMIT ${limit}`;
    }
    return "";
  };

  const whereConnector =
    timeRangeMod().length || accRangeMod().length ? " WHERE " : " ";
  const andConnector =
    timeRangeMod().length && accRangeMod().length ? " AND " : " ";

  const selectStatement = baseStatement.concat(
    whereConnector,
    timeRangeMod(),
    andConnector,
    accRangeMod(),
    " ORDER BY trans_date DESC ",
    limitMod(),
    ";"
  );

  console.log(selectStatement);

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
