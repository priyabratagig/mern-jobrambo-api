const { Profile } = require('../../models')
const { LogicError } = require('../../utils')

const delete_profile = async ({ userid }) => {
    if (!userid) throw new LogicError({ status: 400, message: 'userid not provided' })

    const profile = await Profile.findOneAndDelete({ userid })

    const { _id, __v, deletedProfile } = profile?._doc || {}

    return {
        ...deletedProfile
    }
}

module.exports = {
    delete_profile
}