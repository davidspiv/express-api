import { getQueries, execDbTransaction } from "./utilDb.js";
import { parseCsv } from "./utilParse.js";
import Database from "better-sqlite3";
try {
    const data = (await Promise.all([
        getQueries("./dist/dev/schema.sql"),
        getQueries("./dist/dev/seed.sql"),
        parseCsv("./testInputs/transactions.csv"),
    ]));
    buildDb(data);
}
catch (err) {
    console.log(err);
}
function buildDb(data) {
    const [schemaData, seedData, transArr] = data;
    execDbTransaction(schemaData);
    console.log("Schema successful.");
    execDbTransaction(seedData);
    console.log("Initial seed successful.");
    inputTrans(transArr);
    function inputTrans(transArr) {
        const db = new Database("accounting.db");
        const enterTrans = db.transaction(() => {
            for (const trans of transArr) {
                const insertStatement = `
        INSERT INTO transactions (
          trans_id,
          trans_date,
          trans_date_offset,
          trans_amount,
          trans_memo,
          acc_id
          )
        VALUES (@id, @date, @dateOffset, @amount, @memo, @accId);
        `;
                //better-sql-3 will reject a class instance
                db.prepare(insertStatement).run({ ...trans, accId: 1001 });
            }
        });
        enterTrans();
        db.close();
        console.log(`${transArr.length} transactions input successfully.`);
    }
}
