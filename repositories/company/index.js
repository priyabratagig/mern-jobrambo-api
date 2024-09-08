const { create_company } = require('./create.company.repository.cjs')
const { update_company } = require('./update.company.repository.cjs')
const { get_all_companies_by_recruiter, get_all_listed_companies, get_company, get_all_companies_by_ids } = require('./read.company.repository.cjs')
const { delete_company } = require('./delete.company.repository.cjs')

module.exports = {
    create_company,
    update_company,
    get_all_companies_by_recruiter, get_all_listed_companies, get_company, get_all_companies_by_ids,
    delete_company
}