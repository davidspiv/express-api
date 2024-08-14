import type { Request, Response, NextFunction } from 'express';
import getFormData from '../models/getFormData.js';

export default (req: Request, res: Response, next: NextFunction) => {
	const data = getFormData();
	if (data instanceof Error) {
		res.status(500);
		next(data);
		return;
	}
	return res.status(200).json({ dbResponse: data });
};
