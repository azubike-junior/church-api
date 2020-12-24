import { Router } from 'express';
import { createComment, deleteComment, getCommentsOfPost, updateAComment } from '../controllers/comment';
import { isHodOrMember, verifyUser } from '../middlewares/auth';
import { getUser } from '../middlewares/user';
import { validateCreateComment } from '../utils/validation';

const commentRouter = Router();

commentRouter.post('/:post_id', verifyUser(), getUser(), isHodOrMember(), validateCreateComment(), createComment());

commentRouter.get('/:post_id', verifyUser(), getUser(), isHodOrMember(),  getCommentsOfPost());

commentRouter.delete('/:comment_id', verifyUser(), getUser(), isHodOrMember(), deleteComment());

commentRouter.put('/:comment_id', verifyUser(), getUser(), isHodOrMember(), validateCreateComment(), updateAComment());

export default commentRouter;