import { serverError } from "./http";
import { logger } from "./logger"

export const tryHandler = (handler) => {
    return async (req, res) => {
        try {
            handler(req, res)
        } catch (e) {
            logger.log({
                info: 'e',
                level: 'server error',
                message: e.message
            });
            return serverError(res)
        }
    }
}

export const getBaseUrl = httpRequestOrResponseObj => {
    return `${httpRequestOrResponseObj.protocol}://${httpRequestOrResponseObj.get('host')}`
}