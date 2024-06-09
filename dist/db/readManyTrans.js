import Database from 'better-sqlite3';
import { Transaction } from '../models/classes.js';
export default (limit = 0) => {
    let selectStatement = `
	SELECT * FROM transactions
	ORDER BY trans_date DESC;
	`;
    if (limit) {
        const semicolonIndex = selectStatement.indexOf(';');
        selectStatement = selectStatement
            .slice(0, semicolonIndex)
            .concat('', ` LIMIT ${limit};`);
    }
    const db = new Database('accounting.db', {
        fileMustExist: true,
        readonly: true,
    });
    const resultArr = db.prepare(selectStatement).all();
    db.close();
    const transArr = [];
    for (const resultEl of resultArr) {
        if (!isTrans(resultEl))
            return new Error('Internal database issue');
        transArr.push(new Transaction(resultEl.trans_id, resultEl.trans_date, resultEl.trans_date_offset, resultEl.trans_amount, resultEl.trans_memo, resultEl.user_id, resultEl.acc_code, resultEl.trans_fitid));
    }
    return transArr;
};
function isTrans(obj) {
    return (obj?.trans_id !== undefined &&
        obj?.trans_date !== undefined &&
        obj?.trans_date_offset !== undefined &&
        obj?.trans_amount !== undefined &&
        obj?.trans_memo !== undefined &&
        obj?.user_id !== undefined &&
        obj?.acc_code !== undefined &&
        obj?.trans_fitid !== undefined);
}
