import { Router } from "express";
import addManyTrans from "../controllers/transaction/addMany.js";
import readManyTrans from "../controllers/transaction/readMany.js";
import updateManyTrans from "../controllers/transaction/updateMany.js";
import deleteManyTrans from "../controllers/transaction/deleteMany.js";
import readTrans from "../controllers/transaction/readOne.js";
import updateTrans from "../controllers/transaction/updateOne.js";
import deleteTrans from "../controllers/transaction/deleteOne.js";

import getFormData from "../controllers/getFormData.js";
import getAccData from "../controllers/getAccData.js";

const router = Router();

router.post("/transactions/", addManyTrans);
router.get("/transactions/", readManyTrans);
router.put("/transactions/", updateManyTrans);
router.put("/transactions/", deleteManyTrans);
router.get("/transactions/:id", readTrans);
router.put("/transactions/:id", updateTrans);
router.delete("/transactions/:id", deleteTrans);

router.get("/forms", getFormData);
router.get("/accounts", getAccData);

export default router;
