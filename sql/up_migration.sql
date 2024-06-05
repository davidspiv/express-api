--Up migration

CREATE TABLE account_types (
   type_id TEXT NOT NULL,
   PRIMARY KEY (type_id)
);

CREATE TABLE accounts (
    acc_id TEXT NOT NULL,
    type_id TEXT NOT NULL,
    acc_initial_bal INTEGER DEFAULT 0,
    FOREIGN KEY (type_id)
        REFERENCES account_types(type_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    PRIMARY KEY (acc_id)
);

CREATE TABLE users (
    user_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    user_password TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_role TEXT NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE transactions (
    trans_date TEXT NOT NULL,
    trans_date_offset INTEGER NOT NULL,
    trans_amount INTEGER NOT NULL,
    trans_memo TEXT NOT NULL,
    acc_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    trans_fitid TEXT,
    FOREIGN KEY (acc_id)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    PRIMARY KEY(trans_date, trans_date_offset, acc_id, user_id)
);

CREATE TABLE memos (
    memo_id TEXT NOT NULL,
    acc_id TEXT,
    FOREIGN KEY (acc_id)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    PRIMARY KEY (memo_id)
);

--Base seed

INSERT INTO account_types (type_id)
    VALUES
    ('Expense'),
    ('Asset'),
    ('Equity'),
    ('Revenue'),
    ('Liability');

INSERT INTO accounts (acc_id, type_id)
    VALUES
    ('Checking', 'Asset'),
    ('Savings', 'Asset'),
    ('Petty Cash', 'Asset'),
    ('Receivable', 'Asset'),
    ('Insurance', 'Asset'),
    ('Prepaid', 'Asset'),
    ('Housing', 'Expense'),
    ('Food', 'Expense'),
    ('Utilities', 'Expense'),
    ('Transportation', 'Expense'),
    ('Household', 'Expense'),
    ('Education', 'Expense'),
    ('Gifts', 'Expense'),
    ('Personal', 'Expense'),
    ('Payable', 'Liability'),
    ('Stock', 'Equity');

--Test seed

INSERT INTO users (user_name, user_password, user_email, user_role)
    VALUES
    ('David', 'bebop', 'poop@gmail.com', 'admin');

INSERT INTO memos (memo_id, acc_id)
    VALUES
    ('WL *STEAM PURCHASE SEATTLE WA 10400 NO 4th', 'Personal'),
    ('IN-N-OUT SACRAMENTO SACRAMENTO CA 200O ALT', 'Food'),
    ('POS ARCO#83191J STR SACRAMENTO CA SACRAMEO', 'Transportation');

INSERT INTO transactions (trans_date, trans_date_offset, trans_amount, trans_memo, acc_id, user_id)
    VALUES
    ('05/24/2024', 1, 15, 'WL *STEAM PURCHASE SEATTLE WA 10400 NO 4th', 'Checking', 1),
    ('05/24/2024', 2, 26, 'IN-N-OUT SACRAMENTO SACRAMENTO CA 200O ALT', 'Checking', 1),
    ('05/23/2022', 1, 18, 'POS ARCO#83191J STR SACRAMENTO CA SACRAMEO', 'Checking', 1);
