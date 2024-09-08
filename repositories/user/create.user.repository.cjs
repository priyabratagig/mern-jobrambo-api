const CryptoJS = require("crypto-js")
const { LogicError } = require('../../utils')
const { User } = require('../../models')
const { PASSWORD_SALT } = require('../../config.cjs')

const USERATTRIBUTES = ['isrecruiter', 'fullname', 'phonenumber', 'email', 'password']

const create_user = async ({ userInfo }) => {
    if (!(userInfo instanceof Object)) throw new LogicError({ status: 400, message: 'userInfo not provided' })

    USERATTRIBUTES.forEach(key => {
        if (!userInfo.hasOwnProperty(key))
            throw new LogicError({ status: 400, message: `${key} is required` })
    })

    const user = USERATTRIBUTES.reduce((user, key) => {
        user[key] = userInfo[key]

        if (key === 'password')
            user.password = CryptoJS.AES.encrypt(userInfo.password, PASSWORD_SALT).toString()

        return user
    }, {})

    const newUser = await new User(user).save()
    if (!newUser?._doc) throw new LogicError({ status: 500, message: 'Error saving user' })

    const { _id, __v, pasword, ...savedUser } = newUser._doc

    return {
        ...savedUser,
        userid: String(_id)
    }
}

module.exports = { create_user }