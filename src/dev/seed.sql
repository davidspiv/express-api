-- User Crandice Seed

INSERT INTO users (user_name, user_password, user_email)
    VALUES
    ('Crandice', 'crandice123', 'crandice@gmail.com');

INSERT INTO sources (src_name, src_routing_number, user_id)
    VALUES
    ('Chase Debit', 121000248, 1);

INSERT INTO accounts (acc_code, acc_name, user_id)
    VALUES
    (1001, 'Chase Checking', 1),
    (1002, 'Chase Savings', 1),
    (1003, 'Petty Cash', 1),
    (1004, 'Receivable', 1),
    (1005, 'Prepaid', 1),
    (2001, 'Payable', 1),
    (3001, 'Stock', 1),
    (5001, 'Housing', 1),
    (5002, 'Food', 1),
    (5003, 'Utilities', 1),
    (5004, 'Transportation', 1),
    (5005, 'Household', 1),
    (5006, 'Education', 1),
    (5007, 'Gifts', 1),
    (5008, 'Personal', 1);

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
