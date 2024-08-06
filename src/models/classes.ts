const { randomUUID } = await import('node:crypto');

class Receipt {
	id: string;
	date: string;
	dateOffset: number;
	amount: number;
	memo: string;
	srcId: number;
	isDebit: boolean;
	fitid?: string;

	constructor(
		dateInput: string,
		dateOffsetInput: string | number,
		amountInput: string | number,
		memoInput: string,
		srcId: number,
		isDebit?: boolean,
		idInput?: string,
		fitidInput?: string,
	) {
		this.date = dateInput;
		this.dateOffset = this.toNumber(dateOffsetInput);
		this.amount = this.toNumber(amountInput);
		this.memo = memoInput;
		this.srcId = srcId;
		this.isDebit = isDebit ? isDebit : false;
		this.id = idInput ? idInput : this.createId();
		this.fitid = fitidInput;
	}

	toNumber(input: string | number) {
		if (typeof input === 'string') return Number.parseInt(input);
		return input;
	}

	createId() {
		return randomUUID();
	}
}

export { Receipt };
