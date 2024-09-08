const { Company } = require('../../models')
const { LogicError } = require('../../utils')

const delete_company = async ({ companyid }) => {
    if (!companyid) throw new LogicError({ status: 400, message: 'companyid not provided' })

    const company = await Company.findByIdAndDelete(companyid)

    const { _id, __v, deletedCompany } = company?._doc || {}

    return {
        ...deletedCompany,
        companyid: String(_id)
    }
}

module.exports = {
    delete_company
}