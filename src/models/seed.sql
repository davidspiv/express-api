INSERT INTO users (user_name, user_password, user_email)
    VALUES
    ('Crandice', 'crandice123', 'crandice@gmail.com');

INSERT INTO sources (src_name, src_is_debit, user_id)
    VALUES
    ('Chase Debit', 'TRUE', 1);

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
