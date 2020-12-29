import { Router } from 'express';
import {RegisterUser, LoginUser, verifyAccount, resetPassword, passwordResetReq} from '../controllers/auth'
import { validateLoginUser, validatePassword, validateRegisterUser, validatePasswordResetReq } from '../utils/validation';

const authRouter = Router();

authRouter.post('/register', validateRegisterUser(), RegisterUser());
authRouter.post('/Login', validateLoginUser(), LoginUser());
authRouter.get('/verification/:token', verifyAccount());
authRouter.put('/reset_password/:token', validatePassword() , resetPassword());
authRouter.post('/reset_password', validatePasswordResetReq(), passwordResetReq());


export default authRouter
