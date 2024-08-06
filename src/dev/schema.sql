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
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
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
    src_id INTEGER NOT NULL,
    is_debit BOOLEAN DEFAULT 1,
    FOREIGN KEY (src_id)
        REFERENCES sources(src_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    UNIQUE (rcpt_date, rcpt_date_offset, src_id)
);

CREATE TABLE transactions (
    trans_id TEXT PRIMARY KEY,
    trans_date TEXT NOT NULL,
    trans_amount INTEGER NOT NULL,
    trans_description TEXT NOT NULL,
    debit_acc INTEGER NOT NULL,
    credit_acc INTEGER NOT NULL,
    rcpt_id TEXT,
    FOREIGN KEY (debit_acc)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (credit_acc)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (rcpt_id)
        REFERENCES receipts(rcpt_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
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
