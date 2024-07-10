import { getQueries, runTransaction } from "./utilDb.js";
import { parseCsv } from "./utilParse.js";
import Database from "better-sqlite3";
const schemaStatements = await getQueries("./dist/dev/schema.sql");
const seedStatements = await getQueries("./dist/dev/seed.sql");
const transArr = await parseCsv();
runTransaction(schemaStatements);
console.log("Schema successful.");
runTransaction(seedStatements);
console.log("Initial seed successful.");
inputTrans(transArr);
function inputTrans(transArr) {
    const db = new Database("accounting.db");
    const insertStatement = db.prepare(`
	INSERT INTO
		transactions (trans_id, trans_date, trans_date_offset, trans_amount, trans_memo, acc_id)
	VALUES
		(@id, @date, @dateOffset, @amount, @memo, @accId);
		`);
    const enterTrans = db.transaction(() => {
        for (const trans of transArr) {
            //better-sql-3 will reject a class instance
            insertStatement.run({ ...trans, accId: 1 });
        }
    });
    enterTrans();
    db.close();
    console.log(`${transArr.length} transactions input successfully.`);
}
