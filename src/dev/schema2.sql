--Schema

CREATE TABLE user (
    usr_id INTEGER PRIMARY KEY,
    usr_name TEXT NOT NULL UNIQUE,
    usr_email TEXT NOT NULL UNIQUE,
    usr_password TEXT NOT NULL
);

CREATE TABLE document (
    doc_id INTEGER PRIMARY KEY,
    doc_date_offset INTEGER NOT NULL,
    usr_id INTEGER NOT NULL,
    FOREIGN KEY (usr_id)
        REFERENCES user(usr_id)
        ON DELETE RESTRICT,
    UNIQUE (doc_id, usr_id)
);

CREATE TABLE invoice (
    inv_id INTEGER PRIMARY KEY,
    inv_number INTEGER UNIQUE,
    FOREIGN KEY (inv_id)
        REFERENCES document(doc_id)
        ON DELETE RESTRICT
);

CREATE TABLE receipt (
    rcpt_id INTEGER PRIMARY KEY,
    rcpt_fitid TEXT UNIQUE,
    rcpt_routing_number INTEGER UNIQUE,
    FOREIGN KEY (rcpt_id)
        REFERENCES document(doc_id)
        ON DELETE RESTRICT
);

CREATE TABLE activity (
    act_id INTEGER PRIMARY KEY,
    act_memo INTEGER,
    act_date TEXT NOT NULL,
    usr_id TEXT NOT NULL,
    doc_id INTEGER UNIQUE,
    FOREIGN KEY (act_memo)
        REFERENCES memo(memo_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (usr_id)
        REFERENCES user(usr_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (doc_id)
        REFERENCES document(doc_id)
        ON DELETE RESTRICT,
    UNIQUE (usr_id, doc_id)
);

CREATE TABLE account (
    acc_id INTEGER PRIMARY KEY,
    acc_name INTEGER NOT NULL UNIQUE,
    acc_initial_bal INTEGER NOT NULL,
    acc_is_hidden BOOLEAN DEFAULT 0,
    usr_id TEXT NOT NULL,
    dep_account INTEGER UNIQUE,
    dep_percent_monthly INTEGER,
    FOREIGN KEY (usr_id)
        REFERENCES user(usr_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (dep_account)
        REFERENCES account(acc_id)
        ON DELETE RESTRICT,
    UNIQUE (acc_name, usr_id)
);

CREATE TABLE adjustment (
    adj_is_dr BOOLEAN NOT NULL,
    adj_amount INTEGER NOT NULL,
    act_id TEXT NOT NULL,
    acc_to_adjust TEXT NOT NULL,
    PRIMARY KEY (act_id, acc_to_adjust),
    FOREIGN KEY (act_id)
        REFERENCES activity(act_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (acc_to_adjust)
        REFERENCES account(acc_id)
        ON DELETE RESTRICT
);

CREATE TABLE memo (
    memo_id INTEGER PRIMARY KEY,
    memo_text TEXT NOT NULL,
    usr_id INTEGER NOT NULL,
    acc_default_dr INTEGER,
    acc_default_cr INTEGER,
    FOREIGN KEY (usr_id)
        REFERENCES user(usr_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (acc_default_dr)
        REFERENCES account(acc_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (acc_default_cr)
        REFERENCES account(acc_id)
        ON DELETE RESTRICT,
    UNIQUE (memo_text, usr_id)
);

-- Test seed

INSERT INTO user (usr_name, usr_password, usr_email)
    VALUES
    ('David', 'bebop', 'poop@gmail.com');

INSERT INTO account (acc_id, acc_name, acc_initial_bal, usr_id)
    VALUES
    (1001, 'Schools Checking', 20, 1),
    (1002, 'Schools Savings', 20, 1),
    (1003, 'Petty Cash', 20, 1),
    (1004, 'Receivable', 20, 1),
    (1005, 'Prepaid', 20, 1),
    (2001, 'Payable', 20, 1),
    (3001, 'Stock', 20, 1),
    (5001, 'Housing', 20, 1),
    (5002, 'Food', 20, 1),
    (5003, 'Utilities', 20, 1),
    (5004, 'Transportation', 20, 1),
    (5005, 'Household', 20, 1),
    (5006, 'Education', 20, 1),
    (5007, 'Gifts', 20, 1),
    (5008, 'Personal', 20, 1);

-- Old tests

-- INSERT INTO account_types (type_id, type_name)
--     VALUES
--     (1000, 'Asset'),
--     (2000, 'Liability'),
--     (3000, 'Equity'),
--     (4000, 'Revenue'),
--     (5000, 'Expense')

--     ('David', 1001, 'Schools Checking', 'Cash and cash equivalents'),
--     ('David', 1002, 'Schools Savings', 'Cash and cash equivalents'),
--     ('David', 1003, 'Petty Cash', 'Cash and cash equivalents'),
--     ('David', 1004, 'Receivable', 'A/R'),
--     ('David', 1005, 'Prepaid', 'Prepaid'),
--     ('David', 2001, 'Payable', 'A/P'),
--     ('David', 3001, 'Stock', 'Stock'),
--     ('David', 5001, 'Housing', 'Expense'),
--     ('David', 5002, 'Food', 'Expense'),
--     ('David', 5003, 'Utilities', 'Expense'),
--     ('David', 5004, 'Transportation', 'Expense'),
--     ('David', 5005, 'Household', 'Expense'),
--     ('David', 5006, 'Education', 'Expense'),
--     ('David', 5007, 'Gifts', 'Expense'),
--     ('David', 5008, 'Personal', 'Expense')

-- INSERT INTO memos (memo_id, user_id, acc_code)
--     VALUES
--     ('WL *STEAM PURCHASE SEATTLE WA 10400 NO 4th', 'David', 5008),
--     ('IN-N-OUT SACRAMENTO SACRAMENTO CA 200O ALT', 'David', 5002),
--     ('POS ARCO#83191J STR SACRAMENTO CA SACRAMEO', 'David', 5004)
