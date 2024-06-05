import { getData, parseCsv } from './utils.js';
import Database from 'better-sqlite3';
const db = new Database('accounting.db');
const queryArr = await getQueries('sql/up_migration.sql');
const transArr = await parseCsv('Checking');
runQueries(queryArr);
runTransQueries(transArr);
db.close();
console.log(`
${queryArr.length} initial query(ies) ran successfully.
${transArr.length} transactions input successfully.
`);
async function getQueries(filePath) {
    const data = await getData(filePath);
    if (!data)
        return [];
    const queryArr = data.split(/(?<=;)/g);
    queryArr.pop();
    return queryArr;
}
function runQueries(queries) {
    const enterQueries = db.transaction(() => {
        for (const query of queries) {
            db.prepare(query).run();
        }
    });
    enterQueries();
}
function runTransQueries(transArr) {
    const insertStatement = db.prepare(`
	INSERT INTO
		transactions (trans_date, trans_date_offset, trans_amount, trans_memo, acc_id, user_id)
	VALUES
		(@date, @dateOffset, @amount, @memo, @accId, @userId);
		`);
    const enterTrans = db.transaction(() => {
        for (const trans of transArr) {
            insertStatement.run(trans);
        }
    });
    enterTrans();
}
