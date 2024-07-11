import { Router } from "express";
import addManyTrans from "../controllers/transaction/addManyTrans.js";
import readManyTrans from "../controllers/transaction/readManyTrans.js";
import updateManyTrans from "../controllers/transaction/updateManyTrans.js";
import deleteManyTrans from "../controllers/transaction/deleteManyTrans.js";
import readTrans from "../controllers/transaction/readTrans.js";
import updateTrans from "../controllers/transaction/updateTrans.js";
import deleteTrans from "../controllers/transaction/deleteTrans.js";

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
