const { LogicError } = require('../../utils')
const { Access } = require('../../models')

const get_access = async ({ userid }) => {
    if (!userid) throw new LogicError({ status: 400, message: 'Userid not provided' })

    const access = await Access.findOne({ userid })
    if (!access?._doc) throw new LogicError({ status: 500, message: 'User access not found' })

    const { _id, __v, userid: _userid, ...fetchedAccess } = access._doc

    return {
        ...fetchedAccess,
        userid: String(_userid)
    }
}

const get_all_blocked_userids = async () => {
    let userids = await Access.find({ isblocked: true }, '-isadmin -dashboardvalidity -dashboardvalidity -_id -__v')
    if (!userids) throw new LogicError({ status: 500, message: 'Error fetching access' })

    userids = userids.map(user => String(user._doc.userid))

    return userids
}

module.exports = {
    get_access,
    get_all_blocked_userids
}