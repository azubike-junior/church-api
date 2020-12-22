import { Router } from 'express';
import {RegisterUser, LoginUser} from '../controllers/auth'
import { validateLoginUser, validateRegisterUser } from '../utils/validation';

const authRouter = Router();

authRouter.post('/register', validateRegisterUser(), RegisterUser());
authRouter.post('/Login', validateLoginUser(), LoginUser())

export default authRouter
