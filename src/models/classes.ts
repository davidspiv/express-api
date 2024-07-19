const { randomUUID } = await import("node:crypto");

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
    fitidInput?: string
  ) {
    this.date = dateInput;
    this.dateOffset = this.toNumber(dateOffsetInput);
    this.amount = this.toNumber(amountInput);
    this.memo = memoInput;
    this.accId = accId;
    this.isDebit = isDebit ? isDebit : false;
    this.id = idInput ? idInput : this.createId();
    this.fitid = fitidInput;
  }

  toNumber(input: string | number) {
    if (typeof input === "string") return Number.parseInt(input);
    return input;
  }

  createId() {
    return randomUUID();
  }
}

export { Transaction };
