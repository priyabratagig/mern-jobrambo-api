const { LogicError } = require('../utils')
const { create_job_application, get_job_application, update_job_application, get_all_job_applications_by_applicant, get_job, get_all_job_applications_by_job, get_job_applications_count_by_job } = require('../repositories')

const job_application_create = async ({ loggedinuser, applicationInfo }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (loggedinuser?.user?.isrecruiter !== false) throw new LogicError({ status: 403, message: 'Only students can apply job' })

    const application = await create_job_application({ applicationInfo: { ...applicationInfo, applicantid: loggedinuser.user.userid } })

    return application
}

const job_application_update = async ({ loggedinuser, applicationInfo }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Only recruiter can update job application' })

    const application = await get_job_application({ applicationInfo, fields: 'recruiterid' })

    if (loggedinuser.user.userid !== application.recruiterid) throw new LogicError({ status: 403, message: 'Not Allowed to update this application' })

    const newJobApplication = await update_job_application({ applicationInfo })

    return newJobApplication
}

const job_application_get = async ({ loggedinuser, applicationInfo, fields }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (loggedinuser?.user?.isrecruiter !== false) throw new LogicError({ status: 403, message: 'Not Allowed' })

    const application = await get_job_application({ applicationInfo: { ...applicationInfo, applicantid: loggedinuser.user.userid }, fields })

    return application
}

const job_application_by_applicant_get = async ({ loggedinuser, fields }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (loggedinuser?.user?.isrecruiter !== false) throw new LogicError({ status: 403, message: 'Not Allowed' })

    const applications = await get_all_job_applications_by_applicant({ applicantid: loggedinuser.user.userid, fields })

    return applications
}

const job_application_by_job_get = async ({ loggedinuser, jobid, fields }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Only recruiter can view job applications' })

    const job = await get_job({ jobid })
    if (job.recruiterid !== loggedinuser.user.userid) throw new LogicError({ status: 403, message: 'Not allowed to view applications for this job' })

    const applications = await get_all_job_applications_by_job({ jobid, fields })

    return applications
}

const job_application_count_by_job_get = async ({ jobid }) => {
    const count = await get_job_applications_count_by_job({ jobid })

    return count
}

module.exports = {
    create_job_application: job_application_create,
    update_job_application: job_application_update,
    get_job_application: job_application_get,
    get_all_job_applications_by_applicant: job_application_by_applicant_get,
    get_all_job_applications_by_job: job_application_by_job_get,
    get_job_applications_count_by_job: job_application_count_by_job_get
}