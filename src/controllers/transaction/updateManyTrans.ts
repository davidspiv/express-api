import type { Request, Response, NextFunction } from "express";
import readTrans from "../../db/transaction/readTrans.js";
import updateManyTrans from "../../db/transaction/updateManyTrans.js";
import { Transaction } from "../../models/classes.js";

//@route PUT /api/transactions/update
export default (req: Request, res: Response, next: NextFunction) => {
  if (
    typeof req.body !== "object" ||
    !req.body ||
    !("transactions" in req.body)
  )
    return next(
      Error("@res.body is not an object or doesn't have transactions key.")
    );
  const transArr = req.body.transactions;
  const isArray = Array.isArray(transArr);
  if (!isArray) return next(Error("@req.transactions is not an array."));

  const updateArr = buildInputTransArr();
  const updateTransIdArr: string[] = [];

  if (!updateArr.length)
    return next(
      Error(
        `Input after ${updateTransIdArr[updateTransIdArr.length - 1]} failed.`
      )
    );

  updateManyTrans(updateArr);

  function buildInputTransArr() {
    const transArr: Transaction[] = [];

    for (let i = 0; i < transArr.length; i++) {
      const id = transArr[i].id;
      if (!id) return [];
      const exists = readTrans(id);
      if (!exists) return [];

      const trans = new Transaction(
        id,
        req.body.date,
        req.body.dateOffset,
        req.body.amount,
        req.body.memo,
        req.body.accCode,
        req.body.userId
      );
      transArr.push(trans);
      updateTransIdArr.push(id);
    }

    return transArr;
  }

  res.status(200).json({
    message: `${updateTransIdArr} updated successfully.`,
  });
};
