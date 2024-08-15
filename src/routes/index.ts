import { Router } from 'express';
import type { Response } from 'express';

import addMany from '../controllers/reference/addMany.js';
import readOne from '../controllers/reference/readOne.js';
import readMany from '../controllers/reference/readMany.js';
import deleteOne from '../controllers/reference/deleteOne.js';
import deleteMany from '../controllers/reference/deleteMany.js';
import updateOne from '../controllers/reference/updateOne.js';
import updateMany from '../controllers/reference/updateMany.js';

import getFormData from '../controllers/getFormData.js';
import getAccData from '../controllers/getAccData.js';

const router = Router();

//Journal view
router.post('/references/', addMany);
router.get('/references/', readMany);
router.put('/references/', updateMany);
router.put('/references/', deleteMany);
router.get('/references/:id', readOne);
router.put('/references/:id', updateOne);
router.delete('/references/:id', deleteOne);

//Transaction view
router.get('/transactions/', (res: Response) => {
	res.status(200).json([]);
});

//Other views
router.get('/accounts', getAccData);
router.get('/forms', getFormData);

export default router;
