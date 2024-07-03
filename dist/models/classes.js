class Transaction {
    constructor(dateInput, dateOffsetInput, amountInput, memoInput, userIdInput, accCodeInput, idInput, fitidInput) {
        this.date = dateInput;
        this.dateOffset = this.toNumber(dateOffsetInput);
        this.amount = this.toNumber(amountInput);
        this.memo = memoInput;
        this.userId = userIdInput;
        this.accCode = this.toNumber(accCodeInput);
        this.id = this.createId(dateInput, this.dateOffset, this.accCode, this.userId, idInput);
        this.fitid = fitidInput;
    }
    toNumber(input) {
        if (typeof input === 'string')
            return Number.parseInt(input);
        return input;
    }
    // formatString(input: string) {
    //   return input.replace("'", "''");
    // }
    createId(isoDate, dateOffset, accCode, userId, idInput) {
        if (idInput)
            return idInput;
        const month = isoDate.slice(5, 7);
        const day = isoDate.slice(8, 10);
        const year = isoDate.slice(2, 4);
        const formattedDate = `${month}${day}${year}`;
        const key = Number.parseInt(`${formattedDate}${dateOffset}${accCode}`).toString(36);
        return `${key}${userId}`;
    }
}
export { Transaction };
