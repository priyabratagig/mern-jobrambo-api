const { LogicError } = require('../../utils')
const { Job } = require('../../models')

const get_job = async ({ jobid }) => {
    if (!jobid) throw new LogicError({ status: 400, message: 'jobid not provided' })

    const job = await Job.findById(jobid)
    if (!job?._doc) throw new LogicError({ status: 404, message: 'job not found' })

    const { _id, __v, recruiterid, companyid, ...fetchedJob } = job._doc

    return {
        ...fetchedJob,
        jobid: String(_id),
        recruiterid: String(recruiterid),
        companyid: String(companyid)
    }
}

const get_all_jobs_by_recruiter = async ({ recruiterid }) => {
    if (!recruiterid) throw new LogicError({ status: 400, message: 'recruiterid not provided' })

    let jobs = await Job.find({ recruiterid: recruiterid })
    if (!jobs) throw new LogicError({ status: 500, message: 'Error fetching jobs' })

    jobs = jobs.map(job => {
        let { _id, __v, recruiterid, companyid, ...jobInfo } = job._doc
        jobInfo.jobid = String(_id)
        jobInfo.recruiterid = String(recruiterid)
        jobInfo.companyid = String(companyid)

        return jobInfo
    })

    return jobs
}

const get_all_listed_jobs = async ({ fields, sort, limit, skip, additionalFilters }) => {
    if (!['string', 'object'].includes(typeof fields)) throw new LogicError({ status: 400, message: 'fields are requred' })
    if (!['string', 'object'].includes(typeof sort)) throw new LogicError({ status: 400, message: 'sort are requred' })
    if (!(/\d+/.test(limit))) throw new LogicError({ status: 400, message: 'limit is requred' })

    let jobs = await Job.find(
        { ...(additionalFilters instanceof Object ? additionalFilters : {}) },
        fields,
        { sort, limit, skip: /\d+/.test(skip) ? skip : 0 })
    if (!jobs) throw new LogicError({ status: 500, message: 'Error fetching jobs' })

    jobs = jobs.map(job => {
        let { _id, __v, recruiterid, companyid, ...jobInfo } = job._doc
        jobInfo.jobid = String(_id)
        jobInfo.recruiterid = String(recruiterid)
        jobInfo.companyid = String(companyid)

        return jobInfo
    })

    return jobs
}

const get_all_jobs_by_location = async ({ location, fields, limit }) => {
    if (!location) throw new LogicError({ status: 400, message: 'location not provided' })
    if (!fields) throw new LogicError({ status: 400, message: 'fields are requred' })
    if (!limit) throw new LogicError({ status: 400, message: 'limit is requred' })

    let jobs = await Job.find({ location: new RegExp(location, i) }, fields, { limit })
    if (!jobs) throw new LogicError({ status: 500, message: 'Error fetching jobs' })

    jobs = jobs.map(job => {
        let { _id, __v, recruiterid, companyid, ...jobInfo } = job._doc
        jobInfo.jobid = String(_id)
        jobInfo.recruiterid = String(recruiterid)
        jobInfo.companyid = String(companyid)

        return jobInfo
    })

    return jobs
}

const get_all_jobs_by_type = async ({ type, fields, limit }) => {
    if (!type) throw new LogicError({ status: 400, message: 'type not provided' })
    if (!fields) throw new LogicError({ status: 400, message: 'fields are requred' })
    if (!limit) throw new LogicError({ status: 400, message: 'limit is requred' })

    let jobs = await Job.find({ type: new RegExp(type, i) }, fields, { limit })
    if (!jobs) throw new LogicError({ status: 500, message: 'Error fetching jobs' })

    jobs = jobs.map(job => {
        let { _id, __v, recruiterid, companyid, ...jobInfo } = job._doc
        jobInfo.jobid = String(_id)
        jobInfo.recruiterid = String(recruiterid)
        jobInfo.companyid = String(companyid)

        return jobInfo
    })

    return jobs
}

const get_all_jobs_by_salary = async ({ min, max, fields, limit }) => {
    if (!min) throw new LogicError({ status: 400, message: 'min salary not provided' })
    if (!max) throw new LogicError({ status: 400, message: 'max salary not provided' })
    if (!fields) throw new LogicError({ status: 400, message: 'fields are requred' })
    if (!limit) throw new LogicError({ status: 400, message: 'limit is requred' })

    let jobs = await Job.find({ salary: { min, max } }, fields, { limit })
    if (!jobs) throw new LogicError({ status: 500, message: 'Error fetching jobs' })

    jobs = jobs.map(job => {
        let { _id, __v, recruiterid, companyid, ...jobInfo } = job._doc
        jobInfo.jobid = String(_id)
        jobInfo.recruiterid = String(recruiterid)
        jobInfo.companyid = String(companyid)

        return jobInfo
    })

    return jobs
}

const get_all_jobs_by_jobids = async ({ jobids, fields }) => {
    if (!(jobids instanceof Array) || jobids.some(jobid => typeof jobid !== 'string')) throw new LogicError({ status: 400, message: 'jobids not provided or invalid' })
    if (!['string', 'object'].includes(typeof fields)) throw new LogicError({ status: 400, message: 'fields not provided' })

    let jobs = await Job.find({ _id: { $in: jobids } }, fields)
    if (!jobs) throw new LogicError({ status: 500, message: 'Error fetching jobs' })

    jobs = jobs.map(job => {
        let { _id, __v, recruiter, ...jobInfo } = job._doc
        jobInfo.jobid = String(_id)
        jobInfo.recruiter = String(recruiter)

        return jobInfo
    })

    return jobs
}

const get_all_listed_jobs_count = async ({ additionalFilters }) => {
    const count = await Job.countDocuments({ ...(additionalFilters instanceof Object ? additionalFilters : {}) })
    if (typeof count !== 'number') throw new LogicError({ status: 500, message: 'Error fetching jobs count' })

    return count
}

module.exports = {
    get_job,
    get_all_jobs_by_recruiter,
    get_all_listed_jobs,
    get_all_jobs_by_location,
    get_all_jobs_by_type,
    get_all_jobs_by_salary,
    get_all_jobs_by_jobids,
    get_all_listed_jobs_count
}