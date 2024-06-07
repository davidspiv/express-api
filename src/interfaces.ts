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

interface Transaction {
	id?: string;
	date: string;
	dateOffset: number;
	amount: number;
	memo: string;
	accCode: number;
	userId: string;
	fitid?: string;
}

interface TransactionData {
	trans_id: string;
	trans_date: string;
	trans_date_offset: number;
	trans_amount: number;
	trans_memo: string;
	user_id: string;
	acc_code: number;
	trans_fitid?: string;
}

interface Memo {
	id: string;
	acc_code: string;
}

export type { AccountType, Account, User, Transaction, TransactionData, Memo };
