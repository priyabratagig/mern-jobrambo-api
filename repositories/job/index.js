const { create_job } = require('./create.job.repository.cjs')
const { update_job } = require('./update.job.repository.cjs')
const { get_all_jobs_by_location, get_all_jobs_by_recruiter, get_all_jobs_by_salary, get_all_jobs_by_type, get_all_listed_jobs, get_job, get_all_jobs_by_jobids, get_all_listed_jobs_count } = require('./read.job.repository.cjs')
const { delete_job } = require('./delete.job.repository.cjs')

module.exports = {
    create_job,
    update_job,
    get_all_jobs_by_location, get_all_jobs_by_recruiter, get_all_jobs_by_salary, get_all_jobs_by_type, get_all_listed_jobs, get_job, get_all_jobs_by_jobids, get_all_listed_jobs_count,
    delete_job
}