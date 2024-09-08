const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const { LogicError } = require('../utils')
const { get_user, get_access } = require('../repositories')
const { PASSWORD_SALT, TOKEN_SECRET, TOKEN_EXPIRY } = require('../config.cjs')

const login = async ({ userInfo }) => {
    if (!userInfo?.email) throw new LogicError({ status: 400, message: 'email is required' })
    if (!userInfo?.password) throw new LogicError({ status: 400, message: 'password is required' })

    const user = await get_user({ email: userInfo.email })
    if (!user?.hasOwnProperty('userid')) throw new LogicError({ status: 404, message: 'User not found' })

    const originalPassword = CryptoJS.AES.decrypt(user.password, PASSWORD_SALT).toString(CryptoJS.enc.Utf8)
    if (originalPassword !== userInfo.password) throw new LogicError({ status: 403, message: 'Password didn\'t match' })

    const access = await get_access({ userid: user.userid })
    if (!access?.hasOwnProperty('userid')) throw new LogicError({ status: 500, message: 'User access not found' })

    if (access.isblocked == true) throw new LogicError({ status: 403, message: 'User is blocked' })

    const fetched_userinfo = {
        user,
        access
    }

    const access_token = jwt.sign({
        userid: String(user.userid),
    }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRY
    })

    const refresh_token = jwt.sign({
        userid: String(user.userid),
    }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRY
    })

    return {
        userInfo: fetched_userinfo,
        access_token,
        refresh_token
    }

}

const logout = async () => { }

const authenticate = async ({ access_token }) => {
    if (!access_token) throw new LogicError({ status: 401, message: "unauthorized access" })

    const { userid } = jwt.verify(access_token, TOKEN_SECRET, (err, token) => {
        if (err) throw new LogicError({ status: 400, message: err.message })

        return token
    })

    const user = await get_user({ userid })
    if (!user?.hasOwnProperty('userid')) throw new LogicError({ status: 404, message: 'User not found' })

    const access = await get_access({ userid })
    if (!access?.hasOwnProperty('userid')) throw new LogicError({ status: 500, message: 'User access not found' })

    if (access.isblocked == true) throw new LogicError({ status: 403, message: 'User is blocked' })

    delete user.password

    return {
        user,
        access
    }
}

module.exports = {
    login,
    logout,
    authenticate
}