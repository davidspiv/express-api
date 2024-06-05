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
    acc_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    acc_name TEXT NOT NULL,
    label_id TEXT NOT NULL,
    acc_initial_bal INTEGER DEFAULT 0,
    FOREIGN KEY (acc_id, user_id)
        REFERENCES accounts(acc_id, user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    PRIMARY KEY (acc_id, user_id)
);

CREATE TABLE transactions (
    trans_date TEXT NOT NULL,
    trans_date_offset INTEGER NOT NULL,
    trans_amount INTEGER NOT NULL,
    trans_memo TEXT NOT NULL,
    acc_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    trans_fitid TEXT,
    FOREIGN KEY (acc_id, user_id)
        REFERENCES accounts(acc_id, user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    PRIMARY KEY(trans_date, trans_date_offset, acc_id, user_id)
);

CREATE TABLE memos (
    memo_id TEXT NOT NULL,
    acc_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (acc_id, user_id)
        REFERENCES accounts(acc_id, user_id)
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

INSERT INTO accounts (acc_id, user_id, acc_name, label_id)
    VALUES
    (1001, 'David', 'Schools Checking', 'Cash and cash equivalents'),
    (1002, 'David', 'Schools Savings', 'Cash and cash equivalents'),
    (1003, 'David', 'Petty Cash', 'Cash and cash equivalents'),
    (1004, 'David', 'Receivable', 'A/R'),
    (1005, 'David', 'Prepaid', 'Prepaid'),
    (2001, 'David', 'Payable', 'A/P'),
    (3001, 'David', 'Stock', 'Stock'),
    (5001, 'David', 'Housing', 'Expense'),
    (5002, 'David', 'Food', 'Expense'),
    (5003, 'David', 'Utilities', 'Expense'),
    (5004, 'David', 'Transportation', 'Expense'),
    (5005, 'David', 'Household', 'Expense'),
    (5006, 'David', 'Education', 'Expense'),
    (5007, 'David', 'Gifts', 'Expense'),
    (5008, 'David', 'Personal', 'Expense');

INSERT INTO memos (memo_id, acc_id, user_id)
    VALUES
    ('WL *STEAM PURCHASE SEATTLE WA 10400 NO 4th', 5008, 'David'),
    ('IN-N-OUT SACRAMENTO SACRAMENTO CA 200O ALT', 5002, 'David'),
    ('POS ARCO#83191J STR SACRAMENTO CA SACRAMEO', 5004, 'David');
