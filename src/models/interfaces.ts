interface AccountType {
  id: string;
}

interface Account {
  code: string;
  typeId: string;
  initialBal?: number;
}

interface User {
  id: number;
  name: string;
  password: number;
  email: string;
  role?: string;
}

interface TransactionData {
  trans_id: string;
  trans_date: string;
  trans_date_offset: number;
  trans_amount: number;
  trans_memo: string;
  acc_id: number;
  trans_fitid?: string;
}

interface Memo {
  id: string;
  acc_code: string;
}

export type { AccountType, Account, User, TransactionData, Memo };
