const { LogicError } = require('../../utils')
const { User } = require('../../models')

const get_user = async ({ userid, email }) => {
    if (!userid && !email) throw new LogicError({ status: 400, message: 'userid or email is required' })

    const user = await User.findOne(userid ? { _id: userid } : { email })
    if (!user?._doc) throw new LogicError({ status: 404, message: 'user not found' })

    const { _id, __v, ...fetchedUser } = user._doc

    return {
        ...fetchedUser,
        userid: String(_id)
    }
}

const get_all_users = async ({ loggedinuser }) => {
    if (!loggedinuser?.user?.userid) throw new LogicError({ status: 500, message: 'loggedin userid not provided' })

    let users = await User.find({ _id: { neq: String(loggedinuser?.user?.userid) } })
    if (!users) throw new LogicError({ status: 500, messages: 'Error fetching users' })

    users = users.map(user => {
        let { _id, __v, password, ...userInfo } = user._doc
        userInfo.userid = String(_id)

        return userInfo
    })

    return users
}

const get_all_users_by_ids = async ({ userids, fields, additionalFilter }) => {
    if (!(userids instanceof Array) || userids.some(userid => typeof userid !== 'string')) throw new LogicError({ status: 400, message: 'userids not provided or invalid' })
    if (!['string', 'object'].includes(typeof fields)) throw new LogicError({ status: 400, message: 'fields not provided' })

    let users = await User.find(
        {
            _id: { $in: userids },
            ...(additionalFilter instanceof Object ? additionalFilter : {})
        },
        fields
    )
    if (!users) throw new LogicError({ status: 500, message: 'Error fetching users' })

    users = users.map(user => {
        let { _id, __v, password, ...userInfo } = user._doc
        userInfo.userid = String(_id)

        return userInfo
    })

    return users
}

module.exports = {
    get_user,
    get_all_users,
    get_all_users_by_ids
}