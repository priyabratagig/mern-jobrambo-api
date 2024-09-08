const { create_profile } = require('./create.profile.repository.cjs')
const { update_profile } = require('./update.profile.repository.cjs')
const { get_profile, get_all_profiles_by_userids } = require('./read.profile.repository.cjs')
const { delete_profile } = require('./delete.profile.repository.cjs')

module.exports = {
    create_profile,
    delete_profile,
    get_profile,
    update_profile,
    get_all_profiles_by_userids
}