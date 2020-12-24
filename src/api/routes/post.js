import { Router } from 'express';
import { createPost, deletePost, getPost, getPostByAuthor, getPosts, updateAPost } from '../controllers/post';
import { isHodOrMember,isHOD, verifyUser } from '../middlewares/auth';
import { getUser } from '../middlewares/user';
import { validateCreatePost } from '../utils/validation';

const postRouter = Router();

postRouter.post('/', verifyUser(), getUser(), isHodOrMember(),  validateCreatePost(), createPost());

postRouter.get('/:post_id', verifyUser(), getUser(), isHodOrMember(), getPost());

postRouter.get('/', verifyUser(), getUser(), isHOD(), getPosts());

postRouter.get('/author/:author_id', verifyUser(), getUser(), isHodOrMember(), getPostByAuthor());

postRouter.put('/:post_id', verifyUser(), getUser(), validateCreatePost(), isHodOrMember(), updateAPost());

postRouter.delete('/:post_id', verifyUser(), getUser(), isHodOrMember(), deletePost());

export default postRouter;