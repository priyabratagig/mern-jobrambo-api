const router = require('express').Router()
const { create_company, update_company, get_all_companies_by_recruiter, get_all_companies_by_ids } = require('../services')

router.post('/create', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { companyInfo } = req.body

        const company = await create_company({ loggedinuser, companyInfo })

        return res.status(200).json({ company })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.put('/update', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { companyInfo } = req.body

        const company = await update_company({ loggedinuser, companyInfo })

        return res.status(200).json({ company })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/get-all-companies-by-recruiter', async (req, res) => {
    try {
        const { loggedinuser } = res.locals

        const companies = await get_all_companies_by_recruiter({ loggedinuser })

        return res.status(200).json({ companies: companies })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.post('/fetch-companies-by-ids', async (req, res) => {
    try {
        const { companyids, fields } = req.body

        const companies = await get_all_companies_by_ids({ companyids, fields })

        return res.status(200).json({ companies: companies })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

module.exports = router