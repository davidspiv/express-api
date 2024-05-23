import type { Request, Response, NextFunction } from 'express';

export default (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err.message) {
		res.json({ message: err.message });
		return;
	}

	res.status(500).json({ message: err.message });
};
