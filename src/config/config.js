const dotenv = require('dotenv')
dotenv.config();

const {
    PORT,
    DATABASE_URI,
    SECRET,
    DIALECT,
    NODE_ENV
} = process.env;

module.exports = {
    development: {
        url: DATABASE_URI
    },
    production: {
        url: DATABASE_URI,
        dialect: DIALECT
    },
    appPort: PORT,
    secret: SECRET,
    node_env: NODE_ENV
}

