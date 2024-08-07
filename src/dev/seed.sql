INSERT INTO users (user_name, user_password, user_email)
    VALUES
    ('Crandice', 'crandice123', 'crandice@gmail.com');

INSERT INTO sources (src_name, src_routing_number, user_id)
    VALUES
    ('Chase Debit', 121000248, 1);

INSERT INTO accounts (acc_id, acc_name, user_id)
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

-- INSERT INTO transactions (trans_date, trans_date_offset, trans_amount, trans_memo, acc_id)
--     VALUES
--     ('12/2/21', 0, 43535, 'hello', 2),
--     ('12/3/21', 0, 1233, 'hello', 2),
--     ('12/4/23', 0, 8097, 'hello', 2),
--     ('12/5/23', 0, 67867, 'hello', 2),
--     ('12/6/23', 0, 213412, 'hello', 2),
--     ('12/7/23', 0, 89678, 'hello', 2),
--     ('12/8/23', 0, 234, 'hello', 2),
--     ('12/9/23', 0, 5464, 'hello', 2),
--     ('12/10/23', 0, 234234, 'hello', 2),
--     ('12/11/23', 0, 3453, 'hello', 2),
--     ('12/12/23', 0, 234234, 'hello', 2),
--     ('12/13/23', 0, 6345, 'hello', 2),
--     ('12/14/23', 0, 345345, 'hello', 2),
--     ('12/15/23', 0, 1243124, 'hello', 2),
--     ('12/16/23', 0, 34564, 'hello', 2)

-- Old tests

-- INSERT INTO account_types (type_id, type_name)
--     VALUES
--     (1000, 'Asset'),
--     (2000, 'Liability'),
--     (3000, 'Equity'),
--     (4000, 'Revenue'),
--     (5000, 'Expense')

-- INSERT INTO memos (memo_id, user_id, acc_code)
--     VALUES
--     ('WL *STEAM PURCHASE SEATTLE WA 10400 NO 4th', 'David', 5008),
--     ('IN-N-OUT SACRAMENTO SACRAMENTO CA 200O ALT', 'David', 5002),
--     ('POS ARCO#83191J STR SACRAMENTO CA SACRAMEO', 'David', 5004)
