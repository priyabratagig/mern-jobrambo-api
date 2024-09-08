const { SERVER_PORT, SEVER_IP, MONGODB_URI, MONGODB_PORT, MONGODB_CLUSTER, MONGODB_DBNAMNE, COOCKIE_SECRET, API_ROOT, MONGODB_INSTANCE_LOCAL, DEV, MONGODB_INSTANCE_ATLAS, ALLOWED_ORIGIN } = require('./config.cjs')
const express = require('express')
const json_parser = express.json
const mongoose = require('mongoose')
const cors = require('cors')
const cookie_parser = require('cookie-parser')
const path = require('path')
const os = require('os')
const mongooseValidationErrorTransform = require('mongoose-validation-error-transform')

const authentication = require('./middlewares/auth.midlleware.cjs')

const auth_api = require('./controlers/auth.controller.cjs')
const user_api = require('./controlers/user.controller.cjs')
const company_api = require('./controlers/company.controller.cjs')
const job_api = require('./controlers/job.controller.cjs')
const job_application_api = require('./controlers/jobapplication.controller.cjs')
const payment_api = require('./controlers/payment.controller.cjs')

const jobrambo_webap = 'statics/webapp/jobrambo/dist'
const jobrambo_dashboard_app = 'statics/webapp/jobrambo-dashboard/dist'
const webap_controler = require('./controlers/webapp.controller.cjs')

const app = express()
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }))
app.use(cookie_parser(COOCKIE_SECRET))
app.use(json_parser({ limit: '1mb' }))

app.use(express.static(path.join(__dirname, jobrambo_webap)))
app.use(express.static(path.join(__dirname, jobrambo_dashboard_app)))
app.use('/', webap_controler)

app.use(authentication)
app.use(`/${API_ROOT}/auth`, auth_api)
app.use(`/${API_ROOT}/user`, user_api)
app.use(`/${API_ROOT}/company`, company_api)
app.use(`/${API_ROOT}/job`, job_api)
app.use(`/${API_ROOT}/job-application`, job_application_api)
app.use(`/${API_ROOT}/payment`, payment_api)

try {
    mongoose.plugin(mongooseValidationErrorTransform, {
        capitalize: true,
        humanize: true,
        transform(messages) {
            return messages.join(', ')
        }
    })

    mongoose.connect(MONGODB_URI)
        .then(() => {
            if (MONGODB_INSTANCE_ATLAS) {
                console.log(`Connected to MongoDB on ${MONGODB_CLUSTER} db ${MONGODB_DBNAMNE}`)
            }
            else {
                console.log(`Connected to MongoDB on ${MONGODB_PORT} db ${MONGODB_DBNAMNE}`)
            }
        })
        .catch((err) => {
            console.error(`Error connecting to MongoDB, ${err.message}`)
        })


    app.listen(SERVER_PORT, () => {
        if (DEV) {
            console.log('Server is running in development mode')
            console.log(`Server is running on port ${SERVER_PORT}`)
            console.log(`local: http://localhost:${SERVER_PORT}/`)
            console.log(`public: http://${SEVER_IP}:${SERVER_PORT}`)
        }
        else {
            let ip_address = '127.0.0.1'
            const interfaces = os.networkInterfaces()
            for (const interfaceName in interfaces) {
                const iface = interfaces[interfaceName]
                for (const alias of iface) {
                    if (alias.family === 'IPv4' && !alias.internal) {
                        ip_address = alias.address
                        break
                    }
                }
            } 
            console.log('Server is running in production mode')
            console.log(`Server is running on port ${SERVER_PORT}`)
            console.log(`local: http://localhost:${SERVER_PORT}/`)
            console.log(`public: http://${ip_address}:${SERVER_PORT}`)
        }
    })
} catch (err) {
    console.error(err.message)
}
