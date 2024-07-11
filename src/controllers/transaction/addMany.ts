import type { Request, Response, NextFunction } from "express";
import {
  readLatestTrans,
  addManyTrans,
} from "../../db/transaction/addMany.js";
import { Transaction } from "../../models/classes.js";
import type { TransactionData } from "../../models/interfaces.js";

//@route POST /api/transactions/
export default (req: Request, res: Response, next: NextFunction) => {
  if (
    typeof req.body !== "object" ||
    !req.body ||
    !("transactions" in req.body)
  )
    return next(
      new Error("@res.body is not an object or doesn't have transactions key.")
    );
  const transArr = req.body.transactions;
  const isArray = Array.isArray(transArr);
  if (!isArray) return next(new Error("@req.transactions is not an array."));

  const recentDbTrans = <TransactionData | null>(
    readLatestTrans(req.body.transactions[0].srcId)[0]
  );

  const unseededError = new Error("Database unseeded");
  if (!recentDbTrans) return next(unseededError);

  const inputTransArr = buildInputTransArr();
  sortTransDataArr();
  const sliceIndex = getSliceIndex(recentDbTrans);

  function buildInputTransArr() {
    const arr: Transaction[] = [];

    for (let i = 0; i < transArr.length; i++) {
      const trans = new Transaction(
        transArr[i].date,
        transArr[i].dateOffset,
        transArr[i].amount,
        transArr[i].memo,
        transArr[i].userId,
        transArr[i].accCode
      );
      arr.push(trans);
    }

    return arr;
  }

  function sortTransDataArr() {
    const filterDate = (date: string) => {
      return new Date(Number.parseInt(date)).getTime();
    };
    inputTransArr.sort(
      (a: Transaction, b: Transaction) =>
        filterDate(b.date) - filterDate(a.date)
    );
  }

  function getSliceIndex(recentDbTrans: TransactionData) {
    const id = recentDbTrans.trans_id;
    if (!id) return 0;
    for (let i = 0; i < inputTransArr.length; i++) {
      if (inputTransArr[i].id === id) return i;
    }
    return inputTransArr.length;
  }

  const noNewTransError = new Error("No new transactions to input");
  if (!sliceIndex) return next(noNewTransError);

  const filteredTransArr = inputTransArr.slice(0, sliceIndex);
  addManyTrans(filteredTransArr);
  res.status(200).json(filteredTransArr);
};
