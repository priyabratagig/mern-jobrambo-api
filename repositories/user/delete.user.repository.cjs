const { User } = require('../../models')
const { LogicError } = require('../../utils')

const delete_user = async ({ userid }) => {
    if (!userid) throw new LogicError({ status: 400, message: 'userid not provided' })

    const user = await User.findByIdAndDelete(userid)

    const { _id, __v, password, ...deletedUser } = user?._doc || {}

    return {
        ...deletedUser,
        userid: String(_id)
    }
}

module.exports = {
    delete_user
}