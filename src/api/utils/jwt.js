import jwt from 'jsonwebtoken';
import config from '../../config/config';
const {secret} = config

export const generateToken = (user_id) => {
    return jwt.sign({user_id}, secret)
}

export const decodeToken = (token) => {
    return jwt.verify(token, secret)
}