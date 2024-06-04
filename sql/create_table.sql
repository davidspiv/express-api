CREATE TABLE transactions (
    db_id INTEGER PRIMARY KEY,
    trans_type TEXT NOT NULL,
    date_posted TEXT NOT NULL,
    amount REAL NOT NULL,
    fitid TEXT,
    memo TEXT NOT NULL
);
