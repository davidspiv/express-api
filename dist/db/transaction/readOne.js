import Database from "better-sqlite3";
import { Transaction } from "../../models/classes.js";
export default (id) => {
    const selectStatement = `
	SELECT *
	FROM transactions
	WHERE trans_id = '${id}';
	`;
    const db = new Database("accounting.db", {
        fileMustExist: true,
        readonly: true,
    });
    const resultArr = db.prepare(selectStatement).all();
    db.close();
    const resultEl = resultArr[0];
    const transArr = [];
    if (!isTrans(resultEl))
        return;
    transArr.push(new Transaction(resultEl.trans_date, resultEl.trans_date_offset, resultEl.trans_amount, resultEl.trans_memo, resultEl.acc_id, resultEl.is_debit, resultEl.trans_id, resultEl.trans_fitid));
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
