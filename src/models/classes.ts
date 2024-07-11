class Transaction {
	id: string;
	date: string;
	dateOffset: number;
	amount: number;
	memo: string;
	accId: number;
	isDebit: boolean;
	fitid?: string;

	constructor(
		dateInput: string,
		dateOffsetInput: string | number,
		amountInput: string | number,
		memoInput: string,
		accId: number,
		isDebit?: boolean,
		idInput?: string,
		fitidInput?: string,
	) {
		this.date = dateInput;
		this.dateOffset = this.toNumber(dateOffsetInput);
		this.amount = this.toNumber(amountInput);
		this.memo = memoInput;
		this.accId = accId;
		this.isDebit = isDebit ? isDebit : false;
		this.id = idInput
			? idInput
			: this.createId(this.accId, this.date, this.dateOffset);
		this.fitid = fitidInput;
	}

	toNumber(input: string | number) {
		if (typeof input === 'string') return Number.parseInt(input);
		return input;
	}

	createId(srcId: number, isoDate: string, dateOffset: number) {
		const month = isoDate.slice(5, 7);
		const day = isoDate.slice(8, 10);
		const year = isoDate.slice(2, 4);
		const formattedDate = `${month}${day}${year}`;

		return Number.parseInt(`${srcId}${formattedDate}${dateOffset}`).toString(36);
	}
}

export { Transaction };
