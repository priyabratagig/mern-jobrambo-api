const { authenticate, login, logout } = require('./auth.service.cjs')
const { add_dashboard_validity, block_dashboard_access, delete_user, get_profile, get_user, register_user, update_password, update_user, get_all_users_by_ids, user_set_block } = require('./user.service.cjs')
const { create_company, delete_company, get_all_companies_by_recruiter, get_all_listed_companies, get_company, update_company, get_all_companies_by_ids } = require('./company.service.cjs')
const { create_job, get_all_jobs_by_recruiter, get_all_listed_jobs, get_job, update_job, get_all_jobs_by_jobids, get_all_listed_jobs_count } = require('./job.service.cjs')
const { create_job_application, get_job_application, update_job_application, get_all_job_applications_by_applicant, get_all_job_applications_by_job, get_job_applications_count_by_job } = require('./jobapplication.service.cjs')

module.exports = {
    authenticate, login, logout,
    add_dashboard_validity, block_dashboard_access, delete_user, get_profile, get_user, register_user, update_password, update_user, get_all_users_by_ids, user_set_block,
    create_company, delete_company, get_all_companies_by_recruiter, get_all_listed_companies, get_company, update_company, get_all_companies_by_ids,
    create_job, get_all_jobs_by_recruiter, get_all_listed_jobs, get_job, update_job, get_all_jobs_by_jobids, get_all_listed_jobs_count,
    create_job_application, get_job_application, update_job_application, get_all_job_applications_by_applicant, get_all_job_applications_by_job, get_job_applications_count_by_job
}