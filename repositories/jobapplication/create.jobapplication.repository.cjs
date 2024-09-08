const { LogicError } = require('../../utils')
const { JobApplication } = require('../../models')

const JOBAPPLICATIONATTRIBUTES = ['applicantid', 'jobid', 'companyid', 'recruiterid']

const create_job_application = async ({ applicationInfo }) => {
    if (!(applicationInfo instanceof Object)) throw new LogicError({ status: 400, message: 'applicationInfo not provided' })

    JOBAPPLICATIONATTRIBUTES.forEach(key => {
        if (!applicationInfo.hasOwnProperty(key))
            throw new LogicError({ status: 400, message: `${key} is required` })
    })

    const jobApplication = JOBAPPLICATIONATTRIBUTES.reduce((jobApplication, key) => {
        jobApplication[key] = applicationInfo[key]

        return jobApplication
    }, {})

    const newJobApplicationInfo = await new JobApplication(jobApplication).save()
    if (!newJobApplicationInfo?._doc) throw new LogicError({ status: 500, message: 'Error saving JobApplication' })

    const { _id, __v, ...savedJobApplication } = newJobApplicationInfo.toPlainObject()

    return {
        ...savedJobApplication,
        applicationid: _id
    }
}

module.exports = { create_job_application }