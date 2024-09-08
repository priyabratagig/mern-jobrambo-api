const { LogicError } = require('../../utils')
const { Profile } = require('../../models')

const PROFILEATTRIBUTES = ['bio', 'skills', 'resume']

const update_profile = async ({ profileInfo }) => {
    if (!(profileInfo instanceof Object)) throw new LogicError({ status: 400, message: 'profileInfo not provided' })
    if (!profileInfo.userid) throw new LogicError({ status: 400, message: 'userid not provided' })

    const updateProfileInfo = PROFILEATTRIBUTES.reduce((profile, key) => {
        if (profileInfo.hasOwnProperty(key)) profile[key] = profileInfo[key]

        return profile
    }, {})

    const newProfile = await Profile.findOneAndUpdate(
        { userid: profileInfo.userid },
        { ...updateProfileInfo, userid: profileInfo.userid },
        { runValidators: true, new: true, upsert: true }
    )
    if (!newProfile?._doc) throw new LogicError({ status: 500, message: 'Error updating profile' })

    const { _id, __v, ...newProfileInfo } = newProfile._doc

    return {
        ...newProfileInfo
    }
}

module.exports = {
    update_profile
}