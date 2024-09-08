const router = require('express').Router()
const path = require('path')

router.all(/^\/(?!dashboard|api).*/, async (_, res) => {
    try {
        const indexPath = path.resolve(__dirname, '../statics/webapp/jobrambo/dist/', 'index.html')

        return res.status(200).sendFile(indexPath)
    } catch ({ status, message }) {

        return res.status(status || 400).send(message)
    }
})

router.all(/^\/dashboard\/.*|^\/dashboard$/, async (_, res) => {
    try {
        const indexPath = path.resolve(__dirname, '../statics/webapp/jobrambo-dashboard/dist/', 'index.html')

        return res.status(200).sendFile(indexPath)
    } catch ({ status, message }) {

        return res.status(status || 400).send(message)
    }
})

module.exports = router