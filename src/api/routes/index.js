import authRouter from './auth';
import { Router } from 'express';
import userRouter from './user';
import unitRouter from './unit';
import postRouter from './post';
import commentRouter from './comment';

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/member', userRouter);
appRouter.use('/unit', unitRouter);
appRouter.use('/post', postRouter);
appRouter.use('/post/comment', commentRouter);

export default appRouter