const { LogicError } = require('../../utils')
const { Company } = require('../../models')

const COMPANYATTRIBUTES = ['name', 'description', 'website', 'location', 'logo', 'recruiterid']

const create_company = async ({ companyInfo }) => {
    if (!(companyInfo instanceof Object)) throw new LogicError({ status: 400, message: 'companyInfo not provided' })

    COMPANYATTRIBUTES.forEach(key => {
        if (!companyInfo.hasOwnProperty(key))
            throw new LogicError({ status: 400, message: `${key} is required` })
    })

    const company = COMPANYATTRIBUTES.reduce((company, key) => {
        company[key] = companyInfo[key]

        return company
    }, {})

    const newCompany = await new Company(company).save()
    if (!newCompany?._doc) throw new LogicError({ status: 500, message: 'Error saving company' })

    const { _id, __v, ...savedCompany } = newCompany._doc

    return {
        ...savedCompany,
        companyid: String(_id)
    }
}

module.exports = { create_company }