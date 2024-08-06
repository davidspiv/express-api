interface AccountType {
	id: string;
}

interface Account {
	code: string;
	typeId: string;
	initialBal?: number;
}

interface User {
	id: number;
	name: string;
	password: number;
	email: string;
	role?: string;
}

interface ReceiptData {
	rcpt_id: string;
	rcpt_date: string;
	rcpt_date_offset: number;
	rcpt_amount: number;
	rcpt_memo: string;
	src_id: number;
	is_debit: boolean;
	rcpt_fitid?: string;
}

interface Memo {
	id: string;
	acc_code: string;
}

export type { AccountType, Account, User, ReceiptData, Memo };
