import { Router } from 'express';
import getPosts from '../controllers/getPosts.js';
import getPost from '../controllers/getPost.js';
import addPosts from '../controllers/addPosts.js';
import addPost from '../controllers/addPost.js';
import updatePost from '../controllers/updatePost.js';
import deletePosts from '../controllers/deletePost.js';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', addPosts);
router.post('/:id', addPost);
router.put('/:id', updatePost);
router.delete('/', deletePosts);

export default router;
