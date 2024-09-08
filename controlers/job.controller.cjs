const router = require('express').Router()
const { create_job, update_job, get_all_jobs_by_recruiter, get_all_listed_jobs, get_all_jobs_by_jobids, get_all_listed_jobs_count } = require('../services')

router.post('/create', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { jobInfo } = req.body

        const job = await create_job({ loggedinuser, jobInfo })

        return res.status(200).json({ job })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.put('/update', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { jobInfo } = req.body

        const job = await update_job({ loggedinuser, jobInfo })

        return res.status(200).json({ job })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/get-all-jobs-by-recruiter', async (req, res) => {
    try {
        const { loggedinuser } = res.locals

        const jobs = await get_all_jobs_by_recruiter({ loggedinuser })

        return res.status(200).json({ jobs: jobs })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/get-all-jobs', async (req, res) => {
    try {
        const { fields, sort, limit, skip, additionalFilters } = req.query

        const jobs = await get_all_listed_jobs({ fields, sort, limit, skip, additionalFilters: JSON.parse(additionalFilters || '{}') })

        return res.status(200).json({ jobs })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.post('/fetch-jobs-by-ids', async (req, res) => {
    try {
        const { jobids, fields } = req.body

        const jobs = await get_all_jobs_by_jobids({ jobids, fields })

        return res.status(200).json({ jobs })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/get-jobs-count', async (req, res) => {
    try {
        const { additionalFilters } = req.query

        const count = await get_all_listed_jobs_count({ additionalFilters: JSON.parse(additionalFilters || '{}') })

        return res.status(200).json({ count })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

module.exports = router