const jwt = require('jsonwebtoken')
const { create_user, create_profile, create_access, update_user, update_profile, update_access_block, update_access_dashboard, get_user, get_access, get_profile, delete_user, delete_profile, delete_access, get_all_users_by_ids, get_all_profiles_by_userids, update_password } = require('../repositories')
const { LogicError } = require('../utils')
const { TOKEN_SECRET, TOKEN_EXPIRY } = require('../config.cjs')

const register_user = async (userInfo) => {
    if (!(userInfo instanceof Object)) throw new LogicError({ status: 400, message: 'userInfo not provided' })

    let savedUserdInfo = null, savedProfileInfo = null, savedAccessInfo = null

    try {
        savedUserdInfo = await create_user({ userInfo })
        if (!savedUserdInfo?.hasOwnProperty('userid')) throw new LogicError({ stats: 500, message: 'userInfo not saved' })

        if (!userInfo.isrecruiter) {
            savedProfileInfo = await create_profile({
                profileInfo: {
                    ...userInfo.profile,
                    userid: savedUserdInfo.userid
                }
            })
            if (!savedProfileInfo?.hasOwnProperty('bio')) throw new LogicError({ status: 500, message: 'profileInfo not saved' })
        }

        savedAccessInfo = await create_access({
            accessIfno: {
                userid: savedUserdInfo.userid
            }, userid: savedUserdInfo.userid
        })
        if (!savedAccessInfo?.hasOwnProperty('isadmin')) throw new LogicError({ status: 500, message: 'accessInfo not saved' })

        const access_token = jwt.sign({
            userid: String(savedUserdInfo.userid),
        }, TOKEN_SECRET, {
            expiresIn: TOKEN_EXPIRY
        })

        const refresh_token = jwt.sign({
            userid: String(savedUserdInfo.userid),
        }, TOKEN_SECRET, {
            expiresIn: TOKEN_EXPIRY
        })

        return {
            access_token,
            refresh_token,
            userInfo: {
                user: savedUserdInfo,
                access: savedAccessInfo
            }
        }
    }
    catch (err) {
        if (savedUserdInfo?.hasOwnProperty('userid')) await delete_user({ userid: savedUserdInfo.userid })
        if (savedProfileInfo?.hasOwnProperty('userid')) await delete_profile({ userid: savedProfileInfo.userid })
        if (savedAccessInfo?.hasOwnProperty('userid')) await delete_access({ userid: savedAccessInfo.userid })

        throw err
    }
}

const user_get = async ({ loggedinuser, userid }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (loggedinuser?.user?.userid !== userid) throw new LogicError({ status: 403, message: 'Not allowed to fetch the user' })

    const user = await get_user({ userid })
    if (!user?.userid) throw new LogicError({ status: 404, message: 'User not found' })

    const accessInfo = await get_access({ userid })
    if (!accessInfo?.hasOwnProperty('isadmin')) throw new LogicError({ status: 404, message: 'User access not found' })

    delete user.password

    return {
        user,
        access: accessInfo
    }
}

const profile_get = async ({ loggedinuser }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.userid) throw new LogicError({ status: 404, message: 'User not found' })
    if (loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Recruiters don\'t have profile' })

    const profile = await get_profile({ userid: loggedinuser.user.userid })
    if (!profile.hasOwnProperty('bio')) throw new LogicError({ status: 404, message: 'User profile not found' })

    return profile
}

const get_all_users = async ({ }) => { }

const password_update = async ({ userInfo }) => {
    if (!(userInfo instanceof Object)) throw new LogicError({ status: 400, message: 'userInfo not provided' })

    const validation = ['email', 'phonenumber', 'password']

    validation.forEach(key => {
        if (!userInfo.hasOwnProperty(key))
            throw new LogicError({ tatus: 400, message: `${key} not provided` })
    })

    const user = await get_user({ email: userInfo.email })
    if (!user) throw new LogicError({ status: 404, message: 'User not found' })

    if (user.phonenumber !== userInfo.phonenumber) throw new LogicError({ status: 403, message: 'User info didn\'t match' })

    const savedUserdInfo = await update_password({ userInfo: { ...userInfo, userid: user.userid } })
    if (!savedUserdInfo) throw LogicError({ status: 500, message: 'Error updating password' })

    const accessInfo = await get_access({ userid: savedUserdInfo.userid })
    if (!accessInfo?.hasOwnProperty('isadmin')) throw new LogicError({ status: 500, message: 'User access not found' })

    const access_token = jwt.sign({
        userid: String(savedUserdInfo.userid),
    }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRY
    })

    const refresh_token = jwt.sign({
        userid: String(savedUserdInfo.userid),
    }, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRY
    })

    return {
        userInfo: {
            user: savedUserdInfo,
            access: accessInfo
        },
        access_token,
        refresh_token
    }
}

const user_update = async ({ loggedinuser, userInfo }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (loggedinuser?.user?.userid !== userInfo.userid) throw new LogicError({ status: 403, message: 'Not allowed to update this user' })

    const userInfoPre = await get_user({ userid: userInfo.userid })
    if (!userInfoPre) throw new LogicError({ status: 404, message: 'User not found' })

    let profileInfoPre = null
    if (!userInfoPre.isrecruiter) {
        profileInfoPre = await get_profile({ userid: userInfo.userid })
        if (!profileInfoPre) throw new LogicError({ status: 500, message: 'User profile not found' })
    }

    try {
        const savedUserInfo = await update_user({ userInfo })
        if (!savedUserInfo) throw new LogicError({ status: 500, message: 'userInfo not updated' })

        let savedProfileInfo = null
        if (!savedUserInfo.isrecruiter) {
            savedProfileInfo = await update_profile({ profileInfo: { ...userInfo.profile, userid: savedUserInfo.userid } })
            if (!savedProfileInfo) throw new LogicError({ status: 500, message: 'profileInfo not saved' })
        }

        return {
            user: savedUserInfo,
            profile: savedProfileInfo
        }
    }
    catch (err) {
        await update_user({ userInfo: userInfoPre })

        if (!userInfoPre.isrecruiter) await update_profile({ profileInfo: profileInfoPre })

        throw err
    }
}

const user_set_block = async ({ loggedinuser, userid, block }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.access?.isadmin) throw new LogicError({ status: 403, message: 'Only admins are allowed to block user' })
    if (typeof block != 'boolean') throw new LogicError({ status: 400, message: 'block not provided' })

    if (loggedinuser?.user?.userid == userid) throw new LogicError({ status: 403, message: 'User can\'t block or unblock slef' })

    const user = await get_user({ userid })
    if (!user?.hasOwnProperty('userid')) throw new LogicError({ status: 500, message: 'User not found' })

    delete user.password

    const savedAccessInfo = await update_access_block({ userid, block })
    if (!savedAccessInfo?.hasOwnProperty('userid')) throw new LogicError({ status: 500, message: 'Error blocking user' })

    return {
        user,
        access: savedAccessInfo
    }
}

const add_dashboard_validity = async ({ loggedinuser, userid, issystem }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.access?.isadmin && !issystem) throw new LogicError({ status: 403, message: 'Not allowed to update dashboard validity' })
    if (!userid) throw new LogicError({ status: 400, message: 'userid not provided' })

    const valid_till = new Date()
    valid_till.setMinutes(valid_till.getMinutes() + 10)

    const savedAccess = await update_access_dashboard({ userid, valid_till })

    return {
        ...savedAccess
    }
}

const block_dashboard_access = async ({ loggedinuser, userid }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.access?.isadmin) throw new LogicError({ status: 403, message: 'Not allowed to block dashboard access' })

    const valid_till = null

    const savedAccess = await update_access_dashboard({ userid, valid_till })

    return {
        ...savedAccess
    }
}

const all_users_by_ids_get = async ({ loggedinuser, userids, fields }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Not Allowed' })

    let users = await get_all_users_by_ids({ userids, fields })
    let profiles = await get_all_profiles_by_userids({ userids, fields: 'resume userid' })

    profiles = profiles.reduce((profilesDict, profile) => {
        profilesDict[profile.userid] = profile
        delete profile.userid

        return profilesDict
    }, {})

    users = users.map(user => {
        user.profile = profiles[user.userid]

        return user
    })

    return users
}

const user_delete = async ({ }) => { }

module.exports = {
    register_user,
    get_user: user_get,
    get_profile: profile_get,
    update_password: password_update,
    update_user: user_update,
    user_set_block,
    add_dashboard_validity,
    block_dashboard_access,
    delete_user: user_delete,
    get_all_users_by_ids: all_users_by_ids_get
}