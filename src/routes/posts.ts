import { Router } from 'express';
import getPosts from '../controllers/getAllPosts.js';
import getPost from '../controllers/getPost.js';
import addPost from '../controllers/addPost.js';
import updatePost from '../controllers/updatePost.js';
import deletePost from '../controllers/deletePost.js';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', addPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
