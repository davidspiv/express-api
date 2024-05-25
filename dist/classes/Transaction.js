export default class Transaction {
    constructor(transType, datePostedData, amountData, memoData, fitid = null) {
        this.transType = transType;
        this.datePosted = this.formatDate(datePostedData);
        this.amount = this.formatAmount(amountData);
        this.memo = this.formatMemo(memoData);
        this.fitid = fitid;
    }
    formatDate(datePostedData) {
        return datePostedData;
    }
    formatAmount(amountData) {
        return Number.parseInt(amountData);
    }
    formatMemo(memoData) {
        return memoData.trim();
    }
}
