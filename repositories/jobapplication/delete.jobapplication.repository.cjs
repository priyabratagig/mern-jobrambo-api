const { JobApplication } = require('../../models')
const { LogicError } = require('../../utils')

const delete_job_application = async ({ applicationid }) => {
    if (!applicationid) throw new LogicError({ status: 400, message: 'applicationid not provided' })

    const jobApplication = await JobApplication.findByIdAndDelete(applicationid)

    const { _id, __v, deletedJobApplication } = jobApplication?.toPlainObject() || {}

    return {
        ...deletedJobApplication,
        applicationid: _id
    }
}

module.exports = {
    delete_job_application
}