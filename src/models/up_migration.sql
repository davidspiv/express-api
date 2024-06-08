--Up migration

CREATE TABLE account_types (
   type_id INTEGER NOT NULL,
   type_name TEXT NOT NULL,
   PRIMARY KEY (type_id)
);

CREATE TABLE labels (
    label_id TEXT NOT NULL,
    PRIMARY KEY (label_id)
);

CREATE TABLE users (
    user_id TEXT NOT NULL,
    user_password TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_role TEXT NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE accounts (
    acc_code INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    acc_name TEXT NOT NULL,
    label_id TEXT NOT NULL,
    acc_initial_bal INTEGER DEFAULT 0,
    FOREIGN KEY (acc_code, user_id)
        REFERENCES accounts(acc_code, user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    PRIMARY KEY (acc_code, user_id)
);

CREATE TABLE transactions (
    trans_id TEXT PRIMARY KEY,
    trans_date TEXT NOT NULL,
    trans_date_offset INTEGER NOT NULL,
    trans_amount INTEGER NOT NULL,
    trans_memo TEXT NOT NULL,
    user_id TEXT NOT NULL,
    acc_code INTEGER NOT NULL,
    trans_fitid TEXT,
    FOREIGN KEY (acc_code, user_id)
        REFERENCES accounts(acc_code, user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE memos (
    memo_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    acc_code INTEGER NOT NULL,
    FOREIGN KEY (user_id, acc_code)
        REFERENCES accounts(user_id, acc_code)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    PRIMARY KEY (memo_id)
);

--Base seed

INSERT INTO account_types (type_id, type_name)
    VALUES
    (1000, 'Asset'),
    (2000, 'Liability'),
    (3000, 'Equity'),
    (4000, 'Revenue'),
    (5000, 'Expense');

INSERT INTO labels (label_id)
    VALUES
    ('Cash and cash equivalents'),
    ('A/R'),
    ('Prepaid'),
    ('A/P'),
    ('Stock'),
    ('Expense');

--Test seed

INSERT INTO users (user_id, user_password, user_email, user_role)
    VALUES
    ('David', 'bebop', 'poop@gmail.com', 'admin');

INSERT INTO accounts (user_id, acc_code, acc_name, label_id)
    VALUES
    ('David', 1001, 'Schools Checking', 'Cash and cash equivalents'),
    ('David', 1002, 'Schools Savings', 'Cash and cash equivalents'),
    ('David', 1003, 'Petty Cash', 'Cash and cash equivalents'),
    ('David', 1004, 'Receivable', 'A/R'),
    ('David', 1005, 'Prepaid', 'Prepaid'),
    ('David', 2001, 'Payable', 'A/P'),
    ('David', 3001, 'Stock', 'Stock'),
    ('David', 5001, 'Housing', 'Expense'),
    ('David', 5002, 'Food', 'Expense'),
    ('David', 5003, 'Utilities', 'Expense'),
    ('David', 5004, 'Transportation', 'Expense'),
    ('David', 5005, 'Household', 'Expense'),
    ('David', 5006, 'Education', 'Expense'),
    ('David', 5007, 'Gifts', 'Expense'),
    ('David', 5008, 'Personal', 'Expense');

INSERT INTO memos (memo_id, user_id, acc_code)
    VALUES
    ('WL *STEAM PURCHASE SEATTLE WA 10400 NO 4th', 'David', 5008),
    ('IN-N-OUT SACRAMENTO SACRAMENTO CA 200O ALT', 'David', 5002),
    ('POS ARCO#83191J STR SACRAMENTO CA SACRAMEO', 'David', 5004);
