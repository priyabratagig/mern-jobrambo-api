const { LogicError } = require('../../utils')
const { Profile } = require('../../models')

const get_profile = async ({ userid }) => {
    if (!userid) throw new LogicError({ status: 400, message: 'userid not provided' })

    const profile = await Profile.findOne({ userid })
    if (!profile?._doc) throw new LogicError({ status: 404, message: 'User profile not found' })

    const { _id, __v, userid: _userid, ...fetchedProfile } = profile._doc

    return {
        ...fetchedProfile,
        profileid: String(_id),
        userid: String(_userid)
    }
}

const get_all_profiles_by_userids = async ({ userids, fields }) => {
    if (!(userids instanceof Array) || userids.some(userid => typeof userid !== 'string')) throw new LogicError({ status: 400, message: 'userids not provided or invalid' })
    if (!['string', 'object'].includes(typeof fields)) throw new LogicError({ status: 400, message: 'fields not provided' })

    let profiles = await Profile.find({ userid: { $in: userids } }, fields)
    if (!profiles) throw new LogicError({ status: 500, message: 'Error fetching profiles' })

    profiles = profiles.map(profile => {
        let { _id, __v, userid, ...profileInfo } = profile._doc
        profileInfo.profileid = String(_id)
        profileInfo.userid = String(userid)

        return profileInfo
    })

    return profiles
}

module.exports = {
    get_profile,
    get_all_profiles_by_userids
}