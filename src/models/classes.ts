class Transaction {
	id: string;
	date: string;
	dateOffset: number;
	amount: number;
	memo: string;
	userId: string;
	accCode: number;
	fitid?: string;
	constructor(
		idInput: string,
		dateInput: string,
		dateOffsetInput: string | number,
		amountInput: string | number,
		memoInput: string,
		userIdInput: string,
		accCodeInput: string | number,
		fitidInput?: string,
	) {
		this.id = idInput;
		this.date = dateInput;
		this.dateOffset = this.toNumber(dateOffsetInput);
		this.amount = this.toNumber(amountInput);
		this.memo = memoInput;
		this.userId = userIdInput;
		this.accCode = this.toNumber(accCodeInput);
		this.fitid = fitidInput;
	}

	toNumber(input: string | number) {
		if (typeof input === 'string') return Number.parseInt(input);
		return input;
	}
}

export { Transaction };
