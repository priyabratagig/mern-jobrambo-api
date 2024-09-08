const { LogicError } = require('../../utils')
const { JobApplication } = require('../../models')

const get_job_application = async ({ applicationInfo, fields }) => {
    if (!(applicationInfo instanceof Object)) throw new LogicError({ status: 400, message: 'applicationInfo not provided' })
    if (!['string', 'object'].includes(typeof fields)) throw new LogicError({ status: 400, message: 'fields not provided or set null' })

    const { applicationid, applicantid, jobid } = applicationInfo

    if (!applicationid && (!applicantid || !jobid)) throw new LogicError({ status: 400, message: 'applicationid or applicantid and jobid not provided' })

    const application = applicationid ?
        await JobApplication.findById(applicationid, fields) :
        await JobApplication.findOne({ jobid: jobid, applicantid: applicantid }, fields)

    if (!application?._doc) return null

    const { _id, __v, ...jobApplicationInfo } = application.toPlainObject()

    return {
        ...jobApplicationInfo,
        applicantid: String(_id)
    }
}

const get_all_job_applications_by_job = async ({ jobid, fields }) => {
    if (!jobid) throw new LogicError({ status: 400, message: 'jobid not provided' })
    if (!['string', 'object'].includes(typeof fields)) throw new LogicError({ status: 400, message: 'fields not provided' })

    let applications = await JobApplication.find({ jobid }, fields)
    if (!applications) throw new LogicError({ status: 500, message: 'Error fetching job ppplications' })

    applications = applications.map(application => {
        const { _id, __v, ...applicationInfo } = application.toPlainObject()
        applicationInfo.applicationid = _id

        return applicationInfo
    })

    return applications
}

const get_all_job_applications_by_applicant = async ({ applicantid, fields }) => {
    if (!applicantid) throw new LogicError({ status: 400, message: 'applicantid not provided' })
    if (!['string', 'object'].includes(typeof fields)) throw new LogicError({ status: 400, message: 'fields not provided' })

    let applications = await JobApplication.find({ applicantid: applicantid }, fields)
    if (!applications) throw new LogicError({ status: 500, message: 'Error fetching job ppplications' })

    applications = applications.map(application => {
        let { _id, __v, ...applicationInfo } = application.toPlainObject()
        applicationInfo.applicationid = _id

        return applicationInfo
    })

    return applications
}

const get_job_applications_count_by_job = async ({ jobid }) => {
    if (!jobid) throw new LogicError({ status: 400, message: 'jobid not provided' })

    const applicationCount = await JobApplication.countDocuments({ jobid })
    if (typeof applicationCount !== 'number') throw new LogicError({ status: 500, message: 'Error fetching job applications count' })

    return applicationCount
}

module.exports = {
    get_job_application,
    get_all_job_applications_by_job,
    get_all_job_applications_by_applicant,
    get_job_applications_count_by_job
}