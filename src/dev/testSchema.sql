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


