const { LogicError } = require('../../utils')
const { Job } = require('../../models')

const JOBATTRIBUTES = ['title', 'description', 'requirements', 'salary', 'location', 'type', 'experience', 'positions']

const update_job = async ({ jobInfo }) => {
    if (!(jobInfo instanceof Object)) throw new LogicError({ status: 400, message: 'jobInfo not provided' })
    if (!jobInfo.jobid) throw new LogicError({ status: 400, message: 'jobid not provided' })

    const updateJobInfo = JOBATTRIBUTES.reduce((job, key) => {
        if (jobInfo.hasOwnProperty(key)) job[key] = jobInfo[key]

        return job
    }, {})

    const newJob = await Job.findByIdAndUpdate(
        jobInfo.jobid,
        { ...updateJobInfo },
        { runValidators: true, new: true }
    )
    if (!newJob?._doc) throw new LogicError({ status: 500, message: 'Error updating job' })

    const { _id, __v, ...newJobInfo } = newJob._doc

    return {
        ...newJobInfo,
        jobid: String(_id)
    }
}

module.exports = {
    update_job
}