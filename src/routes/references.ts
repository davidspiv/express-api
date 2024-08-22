import { Router } from 'express';

import addManyRefs from '../controllers/reference/addMany.js';
import readManyRefs from '../controllers/reference/readMany.js';

import addManyEntries from '../controllers/entry/addMany.js';
import readManyEntries from '../controllers/entry/addMany.js';

const router = Router();

//Journal view
router.post('/references/', addManyRefs);
router.get('/references/', readManyRefs);

//Ledger view
router.post('/entries/', addManyEntries);
router.get('/entries/', readManyEntries);

export default router;
