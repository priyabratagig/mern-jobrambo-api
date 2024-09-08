const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
    name: {
        type: String, required: [true, 'Compnay.model name is required'], trim: true
    },
    description: {
        type: String, required: [true, 'Compnay.model description is required'], trim: true
    },
    website: {
        type: String, required: [true, 'Compnay.model website is required'], trim: true
    },
    location: {
        type: String, required: [true, 'Compnay.model location is required'], trim: true
    },
    logo: {
        type: String, required: [true, 'Compnay.model logo is required'], trim: true
    },
    recruiterid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Compnay.model recruiterid is required'],
        ref: 'User',
        immutable: [true, 'Compnay.model recruiterid can\'t be updated'],
        index: true
    }
}, {
    timestamps: true
})

CompanySchema.index({ recruiterid: 1, name: 1 }, { unique: true })
CompanySchema.index({ recruiterid: 1, website: 1 }, { unique: true })

module.exports = mongoose.model('Company', CompanySchema)