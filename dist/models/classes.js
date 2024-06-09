class Transaction {
    constructor(idInput, dateInput, dateOffsetInput, amountInput, memoInput, userIdInput, accCodeInput, fitidInput) {
        this.id = idInput;
        this.date = dateInput;
        this.dateOffset = this.toNumber(dateOffsetInput);
        this.amount = this.toNumber(amountInput);
        this.memo = memoInput;
        this.userId = userIdInput;
        this.accCode = this.toNumber(accCodeInput);
        this.fitid = fitidInput;
    }
    toNumber(input) {
        if (typeof input === 'string')
            return Number.parseInt(input);
        return input;
    }
}
export { Transaction };
