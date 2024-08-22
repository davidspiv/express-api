interface User {
	id: string;
	name: string;
	password: number;
	email: string;
	role?: string;
}

interface User_Data {
	user_id: string;
	user_name: string;
	user_email: string;
	user_password: string;
}

interface Source {
	id: number;
	name: string;
	isDebit: boolean;
	userId: number;
}

interface Account {
	code: string;
	typeId: string;
	initialBal?: number;
}

interface LineItem {
	amount: number;
	entryId: string;
	accId: number;
}

export type { User, User_Data, Source, Account, LineItem };
