--Schema

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL
);

CREATE TABLE sources (
    src_id INTEGER PRIMARY KEY,
    src_name TEXT NOT NULL,
    src_routing_number INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    UNIQUE (src_name, user_id)
);

CREATE TABLE accounts (
    acc_id INTEGER PRIMARY KEY,
    acc_name TEXT NOT NULL,
    acc_initial_bal INTEGER DEFAULT 0,
    acc_is_hidden BOOLEAN DEFAULT 0,
    dep_account INTEGER,
    dep_percent INTEGER,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (dep_account)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE receipts (
    rcpt_id TEXT PRIMARY KEY,
    rcpt_date TEXT NOT NULL,
    rcpt_date_offset INTEGER NOT NULL,
    rcpt_amount INTEGER NOT NULL,
    rcpt_memo TEXT NOT NULL,
    rcpt_fitid TEXT,
    acc_id INTEGER NOT NULL,
    is_debit BOOLEAN DEFAULT 1,
    FOREIGN KEY (acc_id)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    UNIQUE (rcpt_date, rcpt_date_offset, acc_id)
);

CREATE TABLE memos (
    memo_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    acc_default INTEGER NOT NULL,
    memo_text TEXT,
    FOREIGN KEY (acc_default)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    UNIQUE (memo_text, user_id)
);
