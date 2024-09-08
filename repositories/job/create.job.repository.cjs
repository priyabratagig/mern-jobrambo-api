const { LogicError } = require('../../utils')
const { Job } = require('../../models')

const JOBATTRIBUTES = ['title', 'description', 'requirements', 'salary', 'location', 'type', 'experience', 'positions', 'companyid', 'recruiterid']

const create_job = async ({ jobInfo }) => {
    if (!(jobInfo instanceof Object)) throw new LogicError({ status: 400, message: 'jobInfo not provided' })

    JOBATTRIBUTES.forEach(key => {
        if (!jobInfo.hasOwnProperty(key))
            throw new LogicError({ status: 400, message: `${key} is required` })
    })

    const job = JOBATTRIBUTES.reduce((job, key) => {
        job[key] = jobInfo[key]

        return job
    }, {})

    const newJob = await new Job(job).save()
    if (!newJob?._doc) throw new LogicError({ status: 500, message: 'Error saving job' })

    const { _id, __v, ...savedJob } = newJob._doc

    return {
        ...savedJob,
        jobid: String(_id)
    }
}

module.exports = { create_job }