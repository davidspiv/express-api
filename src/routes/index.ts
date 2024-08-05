import { Router } from 'express';

import addMany from '../controllers/receipt/addMany.js';
import readOne from '../controllers/receipt/readOne.js';
import readMany from '../controllers/receipt/readMany.js';
import deleteOne from '../controllers/receipt/deleteOne.js';
import deleteMany from '../controllers/receipt/deleteMany.js';
import updateOne from '../controllers/receipt/updateOne.js';
import updateMany from '../controllers/receipt/updateMany.js';

import getFormData from '../controllers/getFormData.js';
import getAccData from '../controllers/getAccData.js';

const router = Router();

//Journal view
router.post('/receipts/', addMany);
router.get('/receipts/', readMany);
router.put('/receipts/', updateMany);
router.put('/receipts/', deleteMany);
router.get('/receipts/:id', readOne);
router.put('/receipts/:id', updateOne);
router.delete('/receipts/:id', deleteOne);

//Other views
router.get('/accounts', getAccData);
router.get('/forms', getFormData);

export default router;
