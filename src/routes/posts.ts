import { Router } from 'express';
import getPosts from '../controllers/getPosts.js';
import getPost from '../controllers/getPost.js';
import addPosts from '../controllers/addPosts.js';
import updatePost from '../controllers/updatePost.js';
import deletePosts from '../controllers/deletePost.js';

const router = Router();

router.get('/', getPosts);
router.post('/', addPosts);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePosts);

export default router;
