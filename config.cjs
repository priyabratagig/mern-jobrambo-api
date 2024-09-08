const DEV = process.env.NODE_ENV === 'development'
const PROD = process.env.NODE_ENV === 'production'

const SEVER_IP = process.env.IP
const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN

const MONGODB_INSTANCE_LOCAL = process.env.MONGODB_INSTANCE === 'local'
const MONGODB_INSTANCE_ATLAS = process.env.MONGODB_INSTANCE === 'atlas'
const MONGODB_HOST = process.env.MONGODB_HOST
const MONGODB_PORT = parseInt(process.env.MONGODB_PORT)
const MONGODB_DBNAMNE = process.env.MONGODB_DBNAMNE
const MONGODB_USER = process.env.MONGODB_USER
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER
const MONGODB_URI = MONGODB_INSTANCE_LOCAL ?
    `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DBNAMNE}?retryWrites=true&w=majority` :
    `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.7umdv.mongodb.net/${MONGODB_DBNAMNE}?retryWrites=true&w=majority`

const API_ROOT = process.env.API_ROOT

const ACCESS_TOKEN_VALIDITY = parseInt(process.env.ACCESS_TOKEN_VALIDITY, 10)
const REFRESH_TOKEN_VALIDITY = parseInt(process.env.REFRESH_TOKEN_VALIDITY, 10)

const TOKEN_SECRET = process.env.TOKEN_SECRET
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY
const COOCKIE_SECRET = process.env.COOCKIE_SECRET
const COOCKIE_EXPIRY = parseInt(process.env.COOCKIE_EXPIRY, 10)

const PASSWORD_SALT = process.env.PASSWORD_SALT

module.exports = {
    DEV,
    PROD,

    SERVER_PORT,
    SEVER_IP,
    ALLOWED_ORIGIN,

    MONGODB_INSTANCE_LOCAL,
    MONGODB_INSTANCE_ATLAS,
    MONGODB_URI,
    MONGODB_CLUSTER,
    MONGODB_PORT,
    MONGODB_DBNAMNE,

    API_ROOT,

    ACCESS_TOKEN_VALIDITY,
    REFRESH_TOKEN_VALIDITY,

    TOKEN_SECRET,
    TOKEN_EXPIRY,
    COOCKIE_SECRET,
    COOCKIE_EXPIRY,

    PASSWORD_SALT
}