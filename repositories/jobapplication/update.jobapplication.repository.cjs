const { LogicError } = require('../../utils')
const { JobApplication } = require('../../models')

const JOBAPPLICATIONATTRIBUTES = ['status']
const update_job_application = async ({ applicationInfo }) => {
    if (!(applicationInfo instanceof Object)) throw new LogicError({ status: 400, message: 'applicationInfo not provided' })
    if (typeof applicationInfo.applicationid !== 'string') throw new LogicError({ status: 400, message: 'applicationid not provided' })
    if (typeof applicationInfo.status !== 'string') throw new LogicError({ status: 400, message: 'status not provided' })

    const newApplication = await JobApplication.findByIdAndUpdate(
        applicationInfo.applicationid,
        { status: applicationInfo.status },
        { runValidators: true, new: true }
    )
    if (!newApplication?._doc) throw new LogicError({ status: 500, message: 'Error updating status' })

    const { _id, __v, ...savedJobApplication } = newApplication.toPlainObject()

    return {
        ...savedJobApplication,
        applicationid: _id
    }
}

module.exports = {
    update_job_application
}