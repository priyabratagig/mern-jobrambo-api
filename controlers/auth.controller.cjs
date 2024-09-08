const router = require('express').Router()
const { COOCKIE_EXPIRY } = require('../config.cjs')
const { register_user, login, logout, update_password } = require('../services')

router.post('/register', async (req, res) => {
    try {
        const { userInfo } = req.body

        const { access_token, userInfo: _userInfo } = await register_user(userInfo)

        const user = {
            user: { ..._userInfo.user, access: _userInfo.access }
        }

        return res.cookie(
            'access_token',
            access_token,
            { httpOnly: true, signed: true, secure: true, sameSite: true, maxAge: COOCKIE_EXPIRY }
        ).json(user)
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { userInfo } = req.body

        const { access_token, userInfo: _userInfo } = await login({ userInfo })

        const user = {
            user: { ..._userInfo.user, access: _userInfo.access }
        }

        return res.cookie(
            'access_token',
            access_token,
            { httpOnly: true, signed: true, secure: true, sameSite: true, maxAge: COOCKIE_EXPIRY }
        ).json(user)
    }
    catch ({ status, message }) {
        return res.clearCookie('access_token').status(status || 400).json({ message })
    }
})

router.get('/logout', async (_, res) => {
    try {
        await logout()

        return res.clearCookie('access_token').json({ user: null })
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

router.put('/update-password', async (req, res) => {
    try {
        const { userInfo } = req.body

        const { access_token, userInfo: _userInfo } = await update_password({ userInfo })

        const user = {
            user: { ..._userInfo.user, access: _userInfo.access }
        }

        return res.cookie(
            'access_token',
            access_token,
            { httpOnly: true, signed: true, secure: true, sameSite: true, maxAge: COOCKIE_EXPIRY }
        ).json(user)
    }
    catch ({ status, message }) {
        return res.status(status || 400).json({ message })
    }
})

module.exports = router