import validate from 'uuid-validate'
import { badRequest, notFound } from '../utils/http';
import { logger } from '../utils/logger';
import { findUserById } from '../utils/query';

export const getUser = () => async (req, res, next) => {
    const { user_id } = req.user;
    console.log('====id', user_id)
    if (!validate(user_id, 4)) {
        logger.log({
            level: 'error',
            message: 'invalid id'
        })
        return badRequest(res, 'invalid id')
    }
    const foundUser = await findUserById(user_id);
    if (!foundUser) {
        return notFound(res, 'user not found');
    }
    req.foundUser = foundUser;
    return next()
}