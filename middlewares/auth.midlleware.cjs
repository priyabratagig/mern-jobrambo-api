const jwt = require('jsonwebtoken')
const { LogicError } = require('../utils')
const { TOKEN_SECRET, API_ROOT } = require('../config.cjs')
const { authenticate } = require('../services')

const IGNORE_AUTH_ROUTES = [
    /^auth\//,
    /^job\/get-all-jobs\/{0,1}$/, /^job\/get-all-jobs\?.*$/,
    /^job\/get-jobs-count\/{0,1}$/, /^job\/get-jobs-count\?.*$/,
    /^company\/fetch-companies-by-ids/,
    /^job\/fetch-jobs-by-ids/,
    /^job-application\/get-job-application-count\/{0,1}$/, /^job-application\/get-job-application-count\?.*$/
]

const authentication = async (req, res, next) => {
    try {
        const ignore_authentication = IGNORE_AUTH_ROUTES.some(route => route.test(req.url.split(`/${API_ROOT}/`)[1]))
        if (ignore_authentication) return next()

        const { access_token } = req?.signedCookies || {}

        const userInfo = await authenticate({ access_token })

        res.locals.loggedinuser = userInfo

        return next()
    }
    catch ({ status, message }) {
        return res.clearCookie('access_token').status(status || 401).json({ message: message })
    }
}

module.exports = authentication