const { LogicError } = require('../../utils')
const { Access } = require('../../models')

const ACCESSATTRIBUTES = ['userid']

const create_access = async ({ accessIfno }) => {
    if (!(accessIfno instanceof Object)) throw new LogicError({ status: 500, message: 'accessInfo not provided' })

    ACCESSATTRIBUTES.forEach(key => {
        if (!accessIfno.hasOwnProperty(key))
            throw new LogicError({ status: 400, message: `${key} is required` })
    })

    const access = ACCESSATTRIBUTES.reduce((access, key) => {
        access[key] = accessIfno[key]

        return access
    }, {})

    const newAccess = await new Access(access).save()
    if (!newAccess?._doc) throw new LogicError({ status: 500, message: 'Error saving user access' })

    const { _id, __v, ...savedAccess } = newAccess._doc

    return {
        ...savedAccess
    }
}

module.exports = { create_access }