export default class Transaction {
	transType: string;
	datePosted: string;
	amount: number;
	memo: string;
	fitid: string | null;
	constructor(
		transType: string,
		datePostedData: string,
		amountData: string,
		memoData: string,
		fitid: string | null = null,
	) {
		this.transType = transType;
		this.datePosted = this.formatDate(datePostedData);
		this.amount = this.formatAmount(amountData);
		this.memo = this.formatMemo(memoData);
		this.fitid = fitid;
	}

	formatDate(datePostedData: string) {
		return datePostedData;
	}
	formatAmount(amountData: string) {
		return Number.parseInt(amountData);
	}
	formatMemo(memoData: string) {
		return memoData.trim();
	}
}
