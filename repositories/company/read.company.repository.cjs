const { LogicError } = require('../../utils')
const { Company } = require('../../models')

const get_company = async ({ companyid }) => {
    if (!companyid) throw new LogicError({ status: 400, message: 'companyid not provided' })

    const company = await Company.findById(companyid)
    if (!company?._doc) throw new LogicError({ status: 404, message: 'company not found' })

    const { _id, __v, recruiterid, ...fetchedCompany } = company._doc

    return {
        ...fetchedCompany,
        companyid: String(_id),
        recruiterid: String(recruiterid)
    }
}

const get_all_companies_by_recruiter = async ({ recruiterid }) => {
    if (!recruiterid) throw new LogicError({ status: 400, message: 'recruiterid not provided' })

    let companies = await Company.find({ recruiterid: recruiterid })
    if (!companies) throw new LogicError({ status: 500, message: 'Error fetching companies' })

    companies = companies.map(company => {
        let { _id, __v, recruiterid, ...companyInfo } = company._doc
        companyInfo.companyid = String(_id)
        companyInfo.recruiterid = String(recruiterid)

        return companyInfo
    })

    return companies
}

const get_all_listed_companies = async ({ fields }) => {
    if (!fields) throw new LogicError({ status: 400, message: 'fields are requred' })

    let companies = await Company.find({}, fields)
    if (!companies) throw new LogicError({ status: 500, message: 'Error fetching companies' })

    companies = companies.map(company => {
        let { _id, __v, recruiterid, ...companyInfo } = company._doc
        companyInfo.companyid = String(_id)
        companyInfo.recruiterid = String(recruiterid)

        return companyInfo
    })

    return companies
}

const get_all_companies_by_ids = async ({ companyids, fields }) => {
    if (!(companyids instanceof Array) || companyids.some(companyid => typeof companyid !== 'string')) throw new LogicError({ status: 400, message: 'companyids not provided or invalid' })
    if (!['string', 'object'].includes(typeof fields)) throw new LogicError({ status: 400, message: 'fields not provided' })

    let companies = await Company.find({ _id: { $in: companyids } }, fields)
    if (!companies) throw new LogicError({ status: 500, message: 'Error fetching companies' })

    companies = companies.map(company => {
        let { _id, __v, recruiterid, ...companyInfo } = company._doc
        companyInfo.companyid = String(_id)
        companyInfo.recruiterid = String(recruiterid)

        return companyInfo
    })

    return companies
}

module.exports = {
    get_company,
    get_all_companies_by_recruiter,
    get_all_listed_companies,
    get_all_companies_by_ids
}