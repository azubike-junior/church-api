import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_AUTHENTICATED, NOT_FOUND, NO_CONTENT, NOT_AUTHORISED, OK } from "./constant"


export const badRequest = (res, data) => {
    return res.status(BAD_REQUEST).send(data)
}

export const serverError = (res) => {
    return res.status(INTERNAL_SERVER_ERROR).send('something unusual went wrong')
}

export const notFound = (res, message) => {
    return res.status(NOT_FOUND).send({message})
}

export const notAuthenticated = (res, message) => {
    return res.status(NOT_AUTHENTICATED).send({message})
}

export const createdResponse = (res, data) => {
    return res.status(CREATED).send(data)
}

export const successResponse = (res, message) => {
    return res.status(OK).send({message})
}

export const notAuthorised = (res, message) => {
    return res.status(NOT_AUTHORISED).send({message})
}

export const noContent = (res, message) => {
    return res.status(NO_CONTENT).send({message})
}