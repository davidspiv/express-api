class Transaction {
    constructor(dateInput, dateOffsetInput, amountInput, memoInput, accId, idInput, fitidInput) {
        this.date = dateInput;
        this.dateOffset = this.toNumber(dateOffsetInput);
        this.amount = this.toNumber(amountInput);
        this.memo = memoInput;
        this.accId = accId;
        this.id = idInput
            ? idInput
            : this.createId(this.accId, this.date, this.dateOffset);
        this.fitid = fitidInput;
    }
    toNumber(input) {
        if (typeof input === "string")
            return Number.parseInt(input);
        return input;
    }
    createId(srcId, isoDate, dateOffset) {
        const month = isoDate.slice(5, 7);
        const day = isoDate.slice(8, 10);
        const year = isoDate.slice(2, 4);
        const formattedDate = `${month}${day}${year}`;
        return Number.parseInt(`${srcId}${formattedDate}${dateOffset}`).toString(36);
    }
}
export { Transaction };
