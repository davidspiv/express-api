import type { Request, Response, NextFunction } from 'express';
import refDb from './refDb.js';

//@route POST /api/posts/:id
export default (req: Request, res: Response, next: NextFunction) => {
	const posts = [];
	const newPost = {
		id: posts.length + 1,
		title: req.body.title,
	}; 

	if (!newPost) {
		const error = new Error('Please include a title');
		res.status(400);
		return next(error);
	}

	posts.push(newPost);
	res.status(201).json(posts);
};
