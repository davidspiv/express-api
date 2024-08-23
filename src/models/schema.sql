CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL
);

CREATE TABLE sources (
    src_id TEXT PRIMARY KEY,
    src_name TEXT NOT NULL,
    src_is_debit BOOLEAN DEFAULT "TRUE",
    src_routing_number INTEGER,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    UNIQUE (src_name, user_id)
);

CREATE TABLE accounts (
    acc_id TEXT PRIMARY KEY,
    acc_code INTEGER NOT NULL UNIQUE,
    acc_name TEXT NOT NULL,
    acc_initial_bal INTEGER DEFAULT 0,
    acc_is_hidden BOOLEAN DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    UNIQUE (acc_name, user_id)
);

CREATE TABLE templates (
    template_id TEXT PRIMARY KEY,
    template_percent REAL NOT NULL,
    ref_memo INTEGER NOT NULL,
    acc_id INTEGER NOT NULL,
    FOREIGN KEY (ref_memo)
        REFERENCES refs(ref_memo)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    FOREIGN KEY (acc_id)
        REFERENCES accounts(acc_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE refs (
    ref_id TEXT PRIMARY KEY,
    ref_date TEXT NOT NULL,
    ref_date_offset INTEGER NOT NULL,
    ref_memo TEXT NOT NULL,
    ref_amount INTEGER NOT NULL,
    src_id INTEGER NOT NULL,
    ref_fitid TEXT,
    FOREIGN KEY (src_id)
        REFERENCES sources(src_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    UNIQUE (ref_date, ref_date_offset, src_id)
);

CREATE TABLE entries (
    entry_id TEXT PRIMARY KEY,
    entry_date TEXT NOT NULL,
    entry_type TEXT NOT NULL,
    entry_description TEXT NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    UNIQUE (entry_date, entry_type, entry_description, user_id)
);

CREATE TABLE entry_refs (
    ref_id TEXT NOT NULL,
    entry_id TEXT NOT NULL,
    FOREIGN KEY (ref_id)
        REFERENCES refs(ref_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    FOREIGN KEY (entry_id)
        REFERENCES entries(entry_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    PRIMARY KEY (ref_id, entry_id)
);

CREATE TABLE line_items (
    line_id TEXT PRIMARY KEY,
    line_amount INTEGER NOT NULL,
    acc_code INTEGER NOT NULL,
    entry_id TEXT NOT NULL,
    FOREIGN KEY (entry_id)
        REFERENCES entries(entry_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    FOREIGN KEY (acc_code)
        REFERENCES accounts(acc_code)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    UNIQUE (entry_id, acc_code)
);
