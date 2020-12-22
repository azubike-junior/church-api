import authRouter from './auth';
import { Router } from 'express';
import userRouter from './user';
import unitRouter from './unit';

const appRouter = Router();

appRouter.use('/auth', authRouter)
appRouter.use('/member', userRouter)
appRouter.use('/unit', unitRouter)

export default appRouter