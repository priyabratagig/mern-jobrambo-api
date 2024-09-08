const { LogicError } = require('../utils')
const { create_company, get_company, update_company, get_all_companies_by_recruiter, get_all_companies_by_ids } = require('../repositories')

const company_create = async ({ loggedinuser, companyInfo }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'only recruiters can create company' })

    const company = await create_company({ companyInfo: { ...companyInfo, recruiterid: loggedinuser.user.userid } })
    if (!company?.companyid) throw new LogicError({ status: 500, message: 'Error creating company' })

    return company
}

const company_update = async ({ loggedinuser, companyInfo }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Only recruiters can update company' })

    const company = await get_company({ companyid: companyInfo.companyid })

    if (company.recruiterid !== loggedinuser?.user?.userid) throw new LogicError({ status: 403, message: 'Not allowed to update this company' })

    const newCompany = await update_company({ companyInfo })

    return newCompany
}

const company_get = async ({ loggedinuser, companyInfo }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })

    const company = await get_company({ companyid: companyInfo.companyid })

    if (company.recruiterid !== loggedinuser?.user?.userid) throw new LogicError({ status: 403, message: 'Not allowed to view this company' })

    return company
}

const all_companies_by_recruiter_get = async ({ loggedinuser }) => {
    if (!(loggedinuser instanceof Object)) throw new LogicError({ status: 400, message: 'loggedinuser not provided' })
    if (!loggedinuser?.user?.isrecruiter) throw new LogicError({ status: 403, message: 'Not Allowed' })

    const companies = await get_all_companies_by_recruiter({ recruiterid: loggedinuser?.user?.userid })

    return companies
}

const all_compnaies_by_ids_get = async ({ companyids, fields }) => {
    const companies = await get_all_companies_by_ids({ companyids, fields })

    return companies
}

const all_listed_companies_get = async () => { }

const company_delete = async () => { }

module.exports = {
    get_all_companies_by_recruiter: all_companies_by_recruiter_get,
    get_all_listed_companies: all_listed_companies_get,
    create_company: company_create,
    delete_company: company_delete,
    get_company: company_get,
    update_company: company_update,
    get_all_companies_by_ids: all_compnaies_by_ids_get
}