import { badRequest, createdResponse, notFound, serverError, successResponse } from '../utils/http';
import models from '../../database/models';
const {User} = models
import { createAuth, createUser, findUserByEmail, findUserAuth, getUnitById, findUserIfVerified, findUserByToken } from '../utils/query';
import { tryHandler, getBaseUrl} from '../utils/global';
import { logger } from '../utils/logger';
import { decodeToken, generateToken, hasTokenExpired } from '../utils/jwt';
import { message } from '../utils/constant';

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
            const newUser = await createUser({ name, email, created_at: new Date(), first_timer })
            const user_id = newUser.get('user_id');
            await createAuth({ user_id, password });
            const token = generateToken(user_id);
            newUser.sendVerificationEmail(`${getBaseUrl(req)}/auth/verification/${token}`); 
            return createdResponse(res, { message, data: token });
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
         newUser.sendVerificationEmail(`${getBaseUrl(req)}/auth/verification/${token}`); 
        return createdResponse(res, {message, data: token})
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

export const verifyAccount = () => 
    tryHandler(async (req, res) => {
        const { token } = req.params;
        const decoded = decodeToken(token)
        console.log('===========got here')
        const user = await User.findByPk(decoded.user_id);
        if (!user) {
            return notFound(res, 'user not found');
        }
        if (user.get('isVerified')) {
            return badRequest(res, 'user has already been verified')
        }
        user.activateAccount();
        return successResponse(res, 'account verified success')
     })

export const passwordResetReq = () =>
    tryHandler(async (req, res) => {
        const { body: { email } } = req;
        const user = await findUserIfVerified(email);
        if (!user) {
            return notFound(res, `The email address ${email} is not associated with any account. Double-check your email address and try again.`)
        }
        await user.generateResetToken();
        const url = `${getBaseUrl(req)}/auth/password_reset`
        
        await user.sendPasswordResetEmail(url)
        return successResponse(res, {
            message: `Password Reset Email has been Sent Successfully to your email, `.concat(
                "check your Spam in case you did not find it in your inbox"
            ),
        });
    });

export const resetPassword = () => 
    tryHandler(async (req, res) => {
        const { body: { password }, params: { token } } = req;

        const user = await findUserByToken(token);
        if (!user) {
            return notFound(res, 'Password reset token is invalid or has expired.');
        }
        const auth = await findUserAuth(user.user_id);
        await auth.resetPassword(token, password);
        await user.setPasswordTokenNull();

        return successResponse(res, 'your password has been changed successfully')
    })