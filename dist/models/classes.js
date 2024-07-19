const { randomUUID } = await import("node:crypto");
class Transaction {
    constructor(dateInput, dateOffsetInput, amountInput, memoInput, accId, isDebit, idInput, fitidInput) {
        this.date = dateInput;
        this.dateOffset = this.toNumber(dateOffsetInput);
        this.amount = this.toNumber(amountInput);
        this.memo = memoInput;
        this.accId = accId;
        this.isDebit = isDebit ? isDebit : false;
        this.id = idInput ? idInput : this.createId();
        this.fitid = fitidInput;
    }
    toNumber(input) {
        if (typeof input === "string")
            return Number.parseInt(input);
        return input;
    }
    createId() {
        return randomUUID();
    }
}
export { Transaction };
