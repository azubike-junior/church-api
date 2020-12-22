import winston from 'winston';
import config from '../../config/config'

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'church-api' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (config.node_env !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple()
        })
    )
}