const { LogicError } = require('../../utils')
const { Profile } = require('../../models')

const PROFILEATTRIBUTES = ['resume', 'userid']

const create_profile = async ({ profileInfo }) => {
    if (!(profileInfo instanceof Object)) throw new LogicError({ status: 400, message: 'profileInfo not provided' })

    PROFILEATTRIBUTES.forEach(key => {
        if (!profileInfo.hasOwnProperty(key))
            throw new LogicError({ status: 400, message: `${key} is required` })
    })

    const profile = PROFILEATTRIBUTES.reduce((profile, key) => {
        profile[key] = profileInfo[key]

        return profile
    }, {})

    const newProfile = await new Profile(profile).save()
    if (!newProfile?._doc) throw new LogicError({ status: 500, message: 'Error saving profile' })

    const { _id, __v, ...savedProfie } = newProfile._doc

    return {
        ...savedProfie
    }
}

module.exports = { create_profile }