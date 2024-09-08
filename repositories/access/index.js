const { create_access } = require('./create.access.repository.cjs')
const { update_access_block, update_access_dashboard } = require('./update.access.repository.cjs')
const { get_access, get_all_blocked_userids } = require('./read.access.repository.cjs')
const { delete_access } = require('./delete.access.repository.cjs')

module.exports = {
    create_access,
    delete_access,
    get_access,
    update_access_block,
    update_access_dashboard,
    get_all_blocked_userids
}