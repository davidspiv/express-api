CREATE TABLE transactions (
    trans_id INTEGER PRIMARY KEY,
    trans_type TEXT,
    date_posted DATE,
    date_available DATE,
    amount REAL,
    fitid TEXT,
    trans_name TEXT,
    memo TEXT
);
