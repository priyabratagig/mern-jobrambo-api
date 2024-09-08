const { Access } = require('../../models')
const { LogicError } = require('../../utils')

const delete_access = async ({ userid }) => {
    if (!userid) throw new LogicError({ status: 400, message: 'userid not provided' })

    const access = await Access.findOneAndDelete({ userid })

    const { _id, __v, ...deletedAccess } = access?._doc || {}

    return {
        ...deletedAccess
    }
}

module.exports = {
    delete_access
}