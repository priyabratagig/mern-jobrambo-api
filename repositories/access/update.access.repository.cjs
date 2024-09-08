const { LogicError } = require('../../utils')
const { Access } = require('../../models')

const update_access_block = async ({ userid, block }) => {
    if (!userid) throw new LogicError({ status: 400, message: 'userid not provided' })
    if (typeof block !== 'boolean') throw new LogicError({ status: 400, message: 'block not provided' })

    const newAccess = await Access.findOneAndUpdate(
        { userid },
        { isblocked: block },
        { runValidators: true, new: true }
    )
    if (!newAccess?._doc) throw new LogicError({ status: 500, message: 'Error updating block' })

    const { _id, __v, userid: _userid, ...newAccessInfo } = newAccess._doc

    return {
        ...newAccessInfo,
        userid: String(_userid)
    }
}

const update_access_dashboard = async ({ valid_till, userid }) => {
    if (!userid) throw new LogicError({ status: 400, message: 'userid not provided' })
    if (!(valid_till instanceof Date) && !(valid_till === null)) throw new LogicError({ status: 500, message: 'valid_till is not a datetime' })

    const dashboardvalidity = valid_till === null ? valid_till : Math.ceil(valid_till.getTime() / 1000)

    const newAccess = await Access.findOneAndUpdate(
        { userid },
        { dashboardvalidity },
        { runValidators: true, new: true }
    )
    if (!newAccess?._doc) throw new LogicError({ status: 500, message: 'Error updating dashboard access' })

    const { _id, __v, ...newAccessInfo } = newAccess._doc

    return {
        ...newAccessInfo
    }
}

module.exports = {
    update_access_block,
    update_access_dashboard
}