const { LogicError } = require('../../utils')
const { Company } = require('../../models')

const COMPANYATTRIBUTES = ['name', 'description', 'website', 'location', 'logo']

const update_company = async ({ companyInfo }) => {
    if (!(companyInfo instanceof Object)) throw new LogicError({ status: 400, message: 'companyInfo not provided' })
    if (!companyInfo.companyid) throw new LogicError({ status: 400, message: 'companyid not provided' })

    const updateCompanyInfo = COMPANYATTRIBUTES.reduce((company, key) => {
        if (companyInfo.hasOwnProperty(key)) company[key] = companyInfo[key]

        return company
    }, {})

    const newCompany = await Company.findByIdAndUpdate(
        companyInfo.companyid,
        { ...updateCompanyInfo },
        { runValidators: true, new: true }
    )
    if (!newCompany?._doc) throw new LogicError({ status: 500, message: 'Error updating company' })

    const { _id, __v, ...newCompanyInfo } = newCompany._doc

    return {
        ...newCompanyInfo,
        companyid: String(_id)
    }
}

module.exports = {
    update_company
}