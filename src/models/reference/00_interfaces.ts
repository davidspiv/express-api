interface Reference {
	id: string;
	date: string;
	dateOffset: number;
	memo: string;
	amount: number;
	srcId: string;
	fitid?: string;
}

interface Reference_Input {
	date: string;
	dateOffset: number;
	memo: string;
	amount: number;
	fitid?: string;
}

interface Reference_Data {
	ref_id: string;
	ref_date: string;
	ref_date_offset: number;
	ref_memo: string;
	ref_amount: number;
	src_id: string;
	ref_fitid: string;
}

export type { Reference, Reference_Input, Reference_Data };
