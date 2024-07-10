import Database from "better-sqlite3";
const readLatestTrans = (srcId) => {
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
    const queryString = `
    INSERT INTO
		  document (doc_date_offset, usr_id)
	  VALUES
	    (0, ${usrId});

    INSERT INTO
		  receipt (rcpt_id)
    SELECT last_insert_rowid();

    INSERT INTO
		  document (doc_date_offset, usr_id)
	  VALUES
	    (1, ${usrId});

    INSERT INTO
		  receipt (rcpt_id)
    SELECT last_insert_rowid();

    INSERT INTO
      memo (memo_text, usr_id, acc_default_dr, acc_default_cr)
	  VALUES
	    ('hello', ${usrId}, 5002, 1001);

    WITH memoId AS (
      SELECT memo_id
      FROM memo
      WHERE memo_text = 'hello'
    )
    INSERT INTO
		  activity (act_memo, act_date, usr_id, doc_id)
    VALUES
	    (1, 1/1/2024, ${usrId}, 1);
		`;
    const queryArr = queryString.split(/(?<=;)/g);
    queryArr.pop();
    const db = new Database("accounting.db", {
        fileMustExist: true,
    });
    const enterQueries = db.transaction(() => {
        for (const query of queryArr) {
            db.prepare(query).run();
        }
    });
    enterQueries();
    db.close();
};
const addManyTrans = (transArr) => {
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
