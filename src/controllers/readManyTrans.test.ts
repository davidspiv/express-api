import { test } from "vitest";
import fetch from "node-fetch";
import type { Transaction } from "../models/classes.js";

const PORT = process.env.PORT;

async function getData(address: string) {
  const response = await fetch(address);
  const data = await response.json();
  return data;
}

test("@route GET /api/transactions: res formatted correctly", async () => {
  const resBody = await getData(`http://localhost:${PORT}/api/transactions/`);
  const isObj = resBody && resBody !== undefined && typeof resBody === "object";
  if (!isObj) throw new Error("@res.body is not an object.");

  const { transactions } = resBody as { transactions: Transaction[] };

  const hasTransaction =
    transactions !== undefined && typeof transactions === "object";

  if (!hasTransaction)
    throw new Error("@res.body doesn't have transactions key.");

  const isArray = Array.isArray(transactions);
  if (!isArray)
    throw new Error("@res.body @transactions key does not reference an array.");

  for (let i = 0; i < transactions.length; i++) {
    const { id, date, dateOffset, amount, memo, srcId } = transactions[
      i
    ] as Transaction;

    const hasId = id !== undefined && typeof id === "string";
    const hasDate = date !== undefined && typeof date === "string";
    const hasDateOffset =
      dateOffset !== undefined && typeof dateOffset === "number";
    const hasAmount = amount !== undefined && typeof amount === "number";
    const hasMemo = memo !== undefined && typeof memo === "string";
    const hasUserId = srcId !== undefined && typeof srcId === "number";

    if (!hasId)
      throw new Error(
        `@transactions trans_id @index ${i} missing / wrong type.`
      );
    if (!hasDate)
      throw new Error(
        `@transactions trans_date @index ${i} missing / wrong type.`
      );
    if (!hasDateOffset)
      throw new Error(
        `@transactions trans_date_offset @index ${i} missing / wrong type.`
      );
    if (!hasAmount)
      throw new Error(
        `@transactions trans_amount @index ${i} missing / wrong type.`
      );
    if (!hasMemo)
      throw new Error(
        `@transactions trans_memo @index ${i} missing / wrong type.`
      );
    if (!hasUserId)
      throw new Error(
        `@transactions user_id @index ${i} missing / wrong type.`
      );
  }
});
