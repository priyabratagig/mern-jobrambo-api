const router = require('express').Router()
const { get_user, add_dashboard_validity } = require('../services')

router.post('/dashboar-access', async (req, res) => {
    try {
        const { loggedinuser } = res.locals

        await add_dashboard_validity({ loggedinuser, userid: loggedinuser.user.userid, issystem: true })

        const { user, access } = await get_user({ loggedinuser, userid: loggedinuser.user.userid })

        return res.json({ user: { ...user, access } })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

module.exports = router