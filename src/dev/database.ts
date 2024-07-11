import { getData, getQueries, execDbTransaction } from "./utilDb.js";
import { parseCsv, parseOfx } from "./utilParse.js";
import Database from "better-sqlite3";
import type { Transaction } from "../models/classes.js";

try {
  const data = <[string[], string[], Transaction[]]>(
    await Promise.all([
      getQueries("./dist/dev/schema.sql"),
      getQueries("./dist/dev/seed.sql"),
      parseCsv(),
    ])
  );

  buildDb(data);
} catch (err) {
  console.log(err);
}

function buildDb(data: [string[], string[], Transaction[]]) {
  const [schemaData, seedData, transArr] = data;

  execDbTransaction(schemaData);
  console.log("Schema successful.");

  execDbTransaction(seedData);
  console.log("Initial seed successful.");

  inputTrans(transArr);

  function inputTrans(transArr: Transaction[]) {
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
        db.prepare(insertStatement).run({ ...trans, accId: 1 });
      }
    });
    enterTrans();
    db.close();
    console.log(`${transArr.length} transactions input successfully.`);
  }
}
