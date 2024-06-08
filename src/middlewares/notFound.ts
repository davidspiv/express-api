import type { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	const error = new Error('Not Found');
	res.status(404);
	next(error);
};
