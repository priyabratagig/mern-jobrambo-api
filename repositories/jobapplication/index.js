const { create_job_application } = require('./create.jobapplication.repository.cjs')
const { update_job_application } = require('./update.jobapplication.repository.cjs')
const { get_all_job_applications_by_applicant, get_all_job_applications_by_job, get_job_application, get_job_applications_count_by_job } = require('./read.jobapplication.repository.cjs')
const { delete_job_application } = require('./delete.jobapplication.repository.cjs')

module.exports = {
    create_job_application,
    update_job_application,
    get_all_job_applications_by_applicant, get_all_job_applications_by_job, get_job_application, get_job_applications_count_by_job,
    delete_job_application
}