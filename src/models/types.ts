export interface ApiShape {
	entries: [Entry_Input, lineItems: LineItem_Input[]];
}

export interface Entry_Input {
	date: string;
	type: string;
	lineItems: LineItem_Input[];
	description: string;
	refId?: string;
}

export interface Entry {
	is: string;
	date: string;
	type: string; //Opening, Transfer, Closing, Adjusting, Compound
	description: string;
	userId: string;
}

export interface Entry_Data {
	entry_id: string;
	entry_type: string;
	entry_description: string;
	user_id: string;
}

export interface LineItem_Input {
	amount: number;
	accCode: number;
}

export interface LineItem {
	amount: number;
	entryId: string;
	accCode: number;
}

export interface LineItem_Data {
	line_amount: number;
	acc_id: number;
	entry_id: string;
}

export interface Reference_Input {
	date: string;
	dateOffset: number;
	memo: string;
	amount: number;
	fitid?: string;
}

export interface Reference {
	id: string;
	date: string;
	dateOffset: number;
	memo: string;
	amount: number;
	srcId: string;
	fitid?: string;
}

export interface Reference_Data {
	ref_id: string;
	ref_date: string;
	ref_date_offset: number;
	ref_memo: string;
	ref_amount: number;
	src_id: string;
	ref_fitid: string;
}

export interface User {
	id: string;
	name: string;
	password: number;
	email: string;
	role?: string;
}

export interface User_Data {
	user_id: string;
	user_name: string;
	user_email: string;
	user_password: string;
}

export interface Source {
	id: number;
	name: string;
	isDebit: boolean;
	userId: number;
}

export interface Account {
	code: string;
	typeId: string;
	initialBal?: number;
}
