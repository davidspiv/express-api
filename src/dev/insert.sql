INSERT INTO transactions (
    trans_id,
    trans_date,
    trans_date_offset,
    trans_amount,
    trans_memo,
    acc_id
    )
VALUES (@id, @date, @dateOffset, @amount, @memo, @accId);
