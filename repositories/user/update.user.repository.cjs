const CryptoJS = require('crypto-js')
const { LogicError } = require('../../utils')
const { User } = require('../../models')
const { PASSWORD_SALT } = require('../../config.cjs')

const USERATTRIBUTES = ['fullname', 'phonenumber', 'email']

const update_user = async ({ userInfo }) => {
    if (!(userInfo instanceof Object)) throw new LogicError({ status: 400, message: 'userInfo not provided' })
    if (!userInfo.userid) throw new LogicError({ status: 400, message: 'userid not provided' })

    const updateUserInfo = USERATTRIBUTES.reduce((user, key) => {
        if (userInfo.hasOwnProperty(key)) user[key] = userInfo[key]

        return user
    }, {})

    const newUser = await User.findByIdAndUpdate(
        userInfo.userid,
        { ...updateUserInfo },
        { runValidators: true, new: true }
    )
    if (!newUser?._doc) throw new LogicError({ status: 404, message: 'User not found' })

    const { _id, __v, password, ...newUserInfo } = newUser._doc

    return {
        ...newUserInfo,
        userid: String(_id)
    }
}

const update_password = async ({ userInfo }) => {
    if (!(userInfo instanceof Object)) throw new LogicError({ status: 400, message: 'userInfo not provided' })
    if (!userInfo.userid) throw new LogicError({ status: 500, message: 'userid not provided' })
    if (!userInfo.password) throw new LogicError({ status: 500, message: 'password not provided' })

    const updateUserInfo = {
        password: CryptoJS.AES.encrypt(userInfo.password, PASSWORD_SALT).toString()
    }

    const newUser = await User.findByIdAndUpdate(
        userInfo.userid,
        { ...updateUserInfo },
        { runValidators: true, new: true }
    )
    if (!newUser?._doc) throw new LogicError({ status: 404, message: 'user not found' })

    const { _id, __v, password, ...newUserInfo } = newUser._doc

    return {
        ...newUserInfo,
        userid: String(_id)
    }
}

module.exports = {
    update_password,
    update_user
}