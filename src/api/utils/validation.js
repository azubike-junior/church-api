import { check, validationResult } from 'express-validator';
import { badRequest } from './http';
import {logger} from './logger'

const validationResponse = () => (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        logger.log({
            level: 'error',
            message: 'bad request error',
            error: errors.array()
        })
        return badRequest(res, errors)
    }
    return next()
}

const checkString = (field, length = 3) => check(field)
    .isLength({ min: length })
    .withMessage(`${field} require more than ${length} chars`);

export const validateRegisterUser = () => [
    check('email').isEmail().withMessage('email cannot be empty'),
    checkString('password'),
    checkString('name'),
    validationResponse(),
];

export const validateLoginUser = () => [
    check('email').isEmail().withMessage('email cannot be empty'),
    checkString('password'),
    validationResponse(),
]

export const validateCreatePost = () => [
    checkString('content', 5),
    checkString('description', 2),
    validationResponse()
]

export const validateCreateComment = () => [
    checkString('content', 5),
    validationResponse()
]

export const validateCreateUnit = () => [
    checkString('name', 3),
    validationResponse()
]

export const validateUUID = (uuid) => [
    check(uuid).isUUID('4').withMessage('invalid UUID'),
    validationResponse()
]

export const validateInt = (id) => {
    if (!isNaN(parseInt(id, 10))) {
        return false
    }
        return true
}