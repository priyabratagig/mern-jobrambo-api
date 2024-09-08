const router = require('express').Router()
const { create_job_application, get_job_application, get_all_job_applications_by_applicant, get_all_job_applications_by_job, get_job_applications_count_by_job, update_job_application } = require('../services')

router.post('/apply', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { applicationInfo } = req.body

        const application = await create_job_application({ loggedinuser, applicationInfo })

        return res.status(200).json({ application })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/get-application', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { jobid, fields } = req.query

        const application = await get_job_application({ loggedinuser, applicationInfo: { jobid }, fields })

        return res.status(200).json({ application })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/by-applicant', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { fields } = req.query

        const applications = await get_all_job_applications_by_applicant({ loggedinuser, fields })

        return res.status(200).json({ applications })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/get-all-applications-by-job', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { jobid, fields } = req.query

        const applications = await get_all_job_applications_by_job({ loggedinuser, jobid, fields })

        return res.status(200).json({ applications })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/get-job-application-count', async (req, res) => {
    try {
        const { jobid } = req.query

        const count = await get_job_applications_count_by_job({ jobid })

        return res.status(200).json({ count })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.put('/update-status', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { applicationInfo } = req.body

        const application = await update_job_application({ loggedinuser, applicationInfo })

        return res.status(200).json({ application })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

module.exports = router