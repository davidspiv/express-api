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
	accId: string;
	userId: number;
	fitid?: string;
}

interface Memo {
	id: string;
	acc_id: string;
}

export type { AccountType, Account, User, Transaction, Memo };
