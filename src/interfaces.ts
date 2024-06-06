interface AccountType {
	id: string;
}

interface Account {
	id: string;
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
	date: string;
	dateOffset: number;
	amount: number;
	memo: string;
	accId: number;
	userId: string;
	fitid?: string;
}

interface TransactionData {
	trans_date: string;
	trans_date_offset: number;
	trans_amount: number;
	trans_memo: string;
	acc_id: number;
	user_id: string;
	trans_fitid?: string;
}

interface Memo {
	id: string;
	acc_id: string;
}

export type { AccountType, Account, User, Transaction, TransactionData, Memo };
