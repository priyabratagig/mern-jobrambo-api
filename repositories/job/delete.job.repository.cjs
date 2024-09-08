const { Job } = require('../../models')
const { LogicError } = require('../../utils')

const delete_job = async ({ jobid }) => {
    if (!jobid) throw new LogicError({ status: 400, message: 'jobid not provided' })

    const job = await Job.findByIdAndDelete(jobid)

    const { _id, __v, deletedJob } = job?._doc || {}

    return {
        ...deletedJob,
        jobid: String(_id)
    }
}

module.exports = {
    delete_job
}