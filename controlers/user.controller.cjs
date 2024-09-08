const router = require('express').Router()
const { get_all_users_by_ids, get_profile, update_user, user_set_block } = require('../services')

router.get('/loggedin-user', async (req, res) => {
    try {
        const { loggedinuser } = res.locals

        if (!loggedinuser?.hasOwnProperty('user')) {
            res.clearCookie('access_token')

            return res.status(500).json({ message: 'Please re-login' })
        }

        const userInfo = {
            user: { ...loggedinuser.user, access: loggedinuser.access }
        }

        return res.status(200).json(userInfo)
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.post('/fetch-all-users-by-ids', async (req, res) => {
    try {
        const { loggedinuser } = res.locals
        const { userids, fields } = req.body

        const users = await get_all_users_by_ids({ loggedinuser, userids, fields })

        return res.status(200).json({ users })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.get('/profile', async (req, res) => {
    try {
        const { loggedinuser } = res.locals

        const profile = await get_profile({ loggedinuser })

        return res.status(200).json({ profile })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.put('/update', async (req, res) => {
    try {
        const { loggedinuser } = res.locals

        const { userInfo } = req.body

        const { user, profile } = await update_user({ loggedinuser, userInfo })

        return res.status(200).json({ userInfo: { ...user, profile } })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.put('/block', async (req, res) => {
    try {
        const { loggedinuser } = res.locals

        const { userid, block } = req.body

        const { user, access } = await user_set_block({ loggedinuser, userid, block })

        return res.status(200).json({ userInfo: { ...user, access } })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

module.exports = router