interface ApiShape {
	entries: [Entry_Input, lineItems: LineItem_Input[]];
}

interface Entry {
	is: string;
	date: string;
	type: string; //Opening, Transfer, Closing, Adjusting, Compound
	description: string;
	userId: string;
}

interface Entry_Input {
	date: string;
	type: string;
	description: string;
}

interface Entry_Data {
	entry_id: string;
	entry_type: string;
	entry_description: string;
	user_id: string;
}

interface LineItem_Input {
	amount: number;
	accId: number;
}

interface LineItem_Data {
	line_amount: number;
	acc_id: number;
	entry_id: string;
}

export type {
	ApiShape,
	Entry,
	Entry_Input,
	Entry_Data,
	LineItem_Input,
	LineItem_Data,
};
