import { Router } from "express";
import addMany from "../controllers/transaction/addMany.js";
import readOne from "../controllers/transaction/readOne.js";
import readMany from "../controllers/transaction/readMany.js";
import deleteOne from "../controllers/transaction/deleteOne.js";
import deleteMany from "../controllers/transaction/deleteMany.js";
import updateOne from "../controllers/transaction/updateOne.js";
import updateMany from "../controllers/transaction/updateMany.js";
import getFormData from "../controllers/getFormData.js";
import getAccData from "../controllers/getAccData.js";
const router = Router();
//Journal view
router.post("/transactions/", addMany);
router.get("/transactions/", readMany);
router.put("/transactions/", updateMany);
router.put("/transactions/", deleteMany);
router.get("/transactions/:id", readOne);
router.put("/transactions/:id", updateOne);
router.delete("/transactions/:id", deleteOne);
//Other views
router.get("/accounts", getAccData);
router.get("/forms", getFormData);
export default router;
