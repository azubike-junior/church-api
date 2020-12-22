import models from '../../database/models';
import { userType } from '../utils/constant';
const { User } = models;
import { notAuthorised, notAuthenticated} from '../utils/http';
import { decodeToken } from '../utils/jwt';

export const verifyUser = () => async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader === 'undefined') {
        return notAuthenticated(res, 'no bearer token')
    }
    const token = bearerHeader.split(' ')[1]
    if (!token) {
        return notAuthenticated(res, 'no bearer token')
    }
    try {
        const decoded = decodeToken(token);
        const user = await User.findOne({ where: { user_id: decoded.user_id } })
    if (!user) {
        return notAuthenticated(res, 'not authenticated')
    }
    req.user = user;
    return next()
    } catch (e) {
        return notAuthenticated(res, 'please sign in to continue')
    }
}

export const isAdmin = () => (req, res, next) => {
    const user = req.user;
    if (user.account_type !== userType.admin.toString()) {
        return notAuthorised(res, 'unauthorised access')
    }
    return next()
}

export const isHOD = () => (req, res, next) => {
    const user = req.user;
    if (user.account_type !== userType.HOD.toString()) {
        return notAuthorised(res, 'unauthorised access')
    }
    return next()
}

export const isHodOrMember = () => (req,res, next) => {
    const user = req.user;
    if (user.account_type === userType.admin.toString()) {
        return notAuthorised(res, 'unauthorised access')
    }
    return next()
}

export const isHodOrAdmin = () => (req,res, next) => {
    const user = req.user;
    if (user.account_type === userType.member.toString()) {
        return notAuthorised(res, 'unauthorised access')
    }
    return next()
}