--Up migration
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    user_name TEXT NOT NULL,
    email_address TEXT NOT NULL,
    user_password TEXT NOT NULL
);

CREATE TABLE banks (
    bank_id INTEGER PRIMARY KEY,
    bank_name INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE sources (
    src_id INTEGER PRIMARY KEY,
    src_name TEXT NOT NULL,
    src_routing_number INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE accounts (
    acc_id INTEGER PRIMARY KEY,
    acc_code INTEGER NOT NULL,
    acc_name TEXT NOT NULL,
    acc_initial_bal INTEGER DEFAULT 0,
    acc_is_hidden BOOLEAN DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE deprecations (
    dep_id INTEGER PRIMARY KEY,
    dep_percent INTEGER NOT NULL,
    acc_src INTEGER NOT NULL,
    acc_rcv INTEGER NOT NULL,
    FOREIGN KEY (acc_src, acc_rcv)
        REFERENCES accounts(acc_id, acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE transactions (
    trans_id TEXT PRIMARY KEY,
    trans_date TEXT NOT NULL,
    trans_date_offset INTEGER NOT NULL,
    trans_amount INTEGER NOT NULL,
    trans_memo TEXT NOT NULL,
    trans_fitid TEXT,
    acc_id INTEGER NOT NULL,
    FOREIGN KEY (acc_id)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE memos (
    memo_text TEXT,
    user_id INTEGER NOT NULL,
    acc_default INTEGER NOT NULL,
    FOREIGN KEY (acc_default)
        REFERENCES accounts(acc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    PRIMARY KEY (memo_text, user_id)
);

-- Base seed

-- INSERT INTO account_types (type_id, type_name)
--     VALUES
--     (1000, 'Asset'),
--     (2000, 'Liability'),
--     (3000, 'Equity'),
--     (4000, 'Revenue'),
--     (5000, 'Expense')

-- INSERT INTO labels (label_id)
--     VALUES
--     ('Cash and cash equivalents'),
--     ('A/R'),
--     ('Prepaid'),
--     ('A/P'),
--     ('Stock'),
--     ('Expense')

-- --Test seed

-- INSERT INTO users (user_id, user_password, user_email, user_role)
--     VALUES
--     ('David', 'bebop', 'poop@gmail.com', 'admin')

-- INSERT INTO accounts (user_id, acc_code, acc_name, label_id)
--     VALUES
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
