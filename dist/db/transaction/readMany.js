import Database from "better-sqlite3";
import { Transaction } from "../../models/classes.js";
export default (timeRange = "all", accRange = "all", limit = 0) => {
    const readLatest = () => {
        const recentTransStatement = `
    SELECT trans_date
    FROM transactions
    ORDER BY trans_date
    DESC LIMIT 1;
    `;
        const db = new Database("accounting.db", {
            fileMustExist: true,
            readonly: true,
        });
        const recentTrans = (db.prepare(recentTransStatement).all());
        db.close();
        return recentTrans ? recentTrans[0].trans_date : "now";
    };
    const targetDate = readLatest();
    const baseStatement = `
  SELECT * FROM transactions
  `;
    const timeRangeMod = () => {
        switch (timeRange) {
            case "day":
                return `trans_date > date('${targetDate}', '-1 day')`;
            case "week":
                return `trans_date > date('${targetDate}', '-7 day')`;
            case "month":
                return `trans_date > date('${targetDate}', '-30 day')`;
            case "year-to-date":
                return `trans_date > date('${targetDate}', '-365 day')`;
            case "year":
                return `trans_date > date('${targetDate}', '-365 day')`;
            default:
                return "";
        }
    };
    const accRangeMod = () => {
        switch (accRange) {
            case "asset":
                return "acc_id < 2000";
            case "liability":
                return "acc_id > 2000 AND acc_id < 3000";
            case "equity":
                return "acc_id > 3000 AND acc_id < 4000";
            case "revenue":
                return "acc_id > 4000 AND acc_id < 5000";
            case "expense":
                return "acc_id > 5000 AND acc_id < 6000";
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
    const whereConnector = timeRangeMod().length || accRangeMod().length ? " WHERE " : " ";
    const andConnector = timeRangeMod().length && accRangeMod().length ? " AND " : " ";
    const selectStatement = baseStatement.concat(whereConnector, timeRangeMod(), andConnector, accRangeMod(), " ORDER BY trans_date DESC", limitMod(), ";");
    // console.log(selectStatement);
    const db = new Database("accounting.db", {
        fileMustExist: true,
        readonly: true,
    });
    const resultArr = db.prepare(selectStatement).all();
    db.close();
    const transArr = [];
    for (const resultEl of resultArr) {
        if (!isTrans(resultEl))
            return new Error("Internal database issue");
        transArr.push(new Transaction(resultEl.trans_date, resultEl.trans_date_offset, resultEl.trans_amount, resultEl.trans_memo, resultEl.acc_id, resultEl.is_debit, resultEl.trans_id, resultEl.trans_fitid));
    }
    return transArr;
};
function isTrans(obj) {
    return (obj?.trans_id !== undefined &&
        obj?.trans_date !== undefined &&
        obj?.trans_date_offset !== undefined &&
        obj?.trans_amount !== undefined &&
        obj?.trans_memo !== undefined &&
        obj?.acc_id !== undefined &&
        obj?.is_debit !== undefined);
}
