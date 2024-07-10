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

const runQuery = () => {
  const usrId = 1;
  const date = new Date("1/1/2024").toDateString();
  const dateOffset = 0;
  const memoText = "hello";

  const defaultDebitAcc = 5002;
  const defaultCreditAcc = 1001;
  const amount = 200;

  const query1 = `
  INSERT INTO
    memo (memo_text, usr_id, acc_default_dr, acc_default_cr)
  VALUES
    ('${memoText}', ${usrId}, ${defaultDebitAcc}, ${defaultCreditAcc});
`;

  const query2 = "SELECT last_insert_rowid();";

  const db = new Database("accounting.db", {
    fileMustExist: true,
  });
  let memoId: number;
  const createMemo = db.transaction(() => {
    db.prepare(query1).run();
    const selectArr = db.prepare(query2).all();
    memoId = selectArr[0]["last_insert_rowid()"];
  });

  createMemo();

  const queryString = `
    INSERT INTO
		  document (doc_date_offset, usr_id)
	  VALUES
	    (${dateOffset}, ${usrId});

    INSERT INTO
		  receipt (rcpt_id)
    VALUES
	    (last_insert_rowid());

    INSERT INTO
		  activity (act_memo, act_date, usr_id, doc_id)
    VALUES
	    (${memoId}, 'date', ${usrId}, 1);

    INSERT INTO
		  adjustment (adj_is_dr, adj_amount, act_id, acc_to_adjust)
    VALUES
	    (1, ${amount}, last_insert_rowid(), ${defaultDebitAcc});

    INSERT INTO
		  adjustment (adj_is_dr, adj_amount, act_id, acc_to_adjust)
    VALUES
	    (0, ${amount}, last_insert_rowid(), ${defaultCreditAcc});
	`;

  const queryArr = queryString.split(/(?<=;)/g);
  queryArr.pop();
  const enterQueries = db.transaction(() => {
    for (const query of queryArr) {
      db.prepare(query).run();
    }
  });
  enterQueries();

  db.close();
};

const addManyTrans = (transArr: Transaction[]) => {
  const db = new Database("accounting.db", { fileMustExist: true });
  const query = `
	INSERT INTO
		document (doc_date_offset, usr_id)
	VALUES
	  (@dateOffset, @usrId);
  INSERT INTO
		receipt (rcpt_id)
  SELECT last_insert_rowid();
	`;
  const statement = db.prepare(query);
  const insertMany = db.transaction((transArr) => {
    for (const trans of transArr) {
      statement.run({ ...trans, usrId: 1 });
    }
  });
  insertMany(transArr);
  db.close();
};

export { readLatestTrans, runQuery, addManyTrans };
