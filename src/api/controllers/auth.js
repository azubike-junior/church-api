import { badRequest, createdResponse } from '../utils/http';
import { createAuth, createUser, findUserByEmail, findUserAuth, getUnitById } from '../utils/query';
import { tryHandler } from '../utils/global';
import { logger } from '../utils/logger';
import { generateToken } from '../utils/jwt';

export const RegisterUser = () => 
    tryHandler(async (req, res) => {
        const { name, email, password, first_timer, worker, unit} = req.body;
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            logger.log({
                level: 'error',
                message:'Email is not available'
            })
            return badRequest(res, {message: 'Email is not available'});
        }
        if (first_timer) {
            const newUser = await createUser({ name, email, first_timer })
            const user_id = newUser.get('user_id');
            await createAuth({ user_id, password });
            const token = generateToken(user_id);
            return createdResponse(res, {token})
        }
        const userUnit = await getUnitById(unit)
        if (!userUnit) {
             return badRequest(res, {message: 'unit doesnt exist'});
        }
        const newUser = await createUser({ name, email, first_timer, worker, unit, created_at: new Date() })
        await userUnit.increment('numberOfPeople')
        const user_id = newUser.get('user_id');
       
        await createAuth({ user_id, password });

        const token = generateToken(user_id);
        return createdResponse(res, {token})
    })


export const LoginUser = () => 
    tryHandler(async (req, res) => {
        const { email, password } = req.body;
        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            logger.log({
                level: 'error',
                message:'Email is not available'
            })
            return badRequest(res, {message: 'Invalid Login Credentials'})
        }
        const {user_id} = existingUser
        const auth = await findUserAuth(user_id);

        if (!auth.comparePassword(password)) {
            logger.log({
                level: 'error',
                message:'invalid credentials'
            })
            return badRequest(res, {message: 'Invalid Login Credentials'})
        }
        const token = generateToken(user_id);
        return createdResponse(res, {token})
    })