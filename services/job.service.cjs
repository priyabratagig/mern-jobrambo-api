const { LogicError } = require('../utils')
const { create_job, get_job, update_job, get_all_jobs_by_recruiter, get_all_listed_jobs, get_all_jobs_by_jobids, get_all_listed_jobs_count, get_all_blocked_userids } = require('../repositories')

const job_create = async ({ loggedinuser, jobInfo }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Only recruiters can create job' })

    const job = await create_job({ jobInfo: { ...jobInfo, recruiterid: loggedinuser.user.userid } })
    if (!job?.jobid) throw new LogicError({ status: 500, message: 'Error creating job' })

    return job
}

const job_update = async ({ loggedinuser, jobInfo }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Only recruiters can update job' })

    const job = await get_job({ jobid: jobInfo.jobid })

    if (job.recruiterid !== loggedinuser?.user?.userid) throw new LogicError({ status: 403, message: 'Not allowed to update this job' })

    const newJob = await update_job({ jobInfo })

    return newJob
}

const job_get = async ({ jobInfo }) => {
    const job = await get_job({ jobid: jobInfo.jobid })

    return job
}

const all_jobs_by_recruiter_get = async ({ loggedinuser }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Not Allowed' })

    const jobs = await get_all_jobs_by_recruiter({ recruiterid: loggedinuser?.user?.userid })

    return jobs
}

const all_listed_jobs_get = async ({ fields, sort, limit, skip, additionalFilters }) => {
    const blocke_users = await get_all_blocked_userids()

    const updatedAdditionalFilters = {
        ...(additionalFilters instanceof Object ? additionalFilters : {}),
        recruiterid: { $nin: blocke_users }
    }

    const jobs = await get_all_listed_jobs({ fields, sort, limit, skip, additionalFilters: updatedAdditionalFilters })

    return jobs
}

const all_jobs_by_jobids = async ({ jobids, fields }) => {
    const jobs = await get_all_jobs_by_jobids({ jobids, fields })

    return jobs
}

const all_listed_jobs_count_get = async ({ additionalFilters }) => {
    const blocke_users = await get_all_blocked_userids()

    const updatedAdditionalFilters = {
        ...(additionalFilters instanceof Object ? additionalFilters : {}),
        recruiterid: { $nin: blocke_users }
    }

    const count = await get_all_listed_jobs_count({ additionalFilters: updatedAdditionalFilters })
    if (typeof count !== 'number') LogicError({ status: 500, message: 'Error fetching jobs count' })

    return count
}

module.exports = {
    create_job: job_create,
    update_job: job_update,
    get_job: job_get,
    get_all_jobs_by_recruiter: all_jobs_by_recruiter_get,
    get_all_listed_jobs: all_listed_jobs_get,
    get_all_jobs_by_jobids: all_jobs_by_jobids,
    get_all_listed_jobs_count: all_listed_jobs_count_get
}