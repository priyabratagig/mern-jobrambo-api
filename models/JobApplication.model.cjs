const mongoose = require('mongoose')

const JobApplicationSchema = new mongoose.Schema({
    applicantid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'JobApplication.model applicantid is required'],
        ref: 'User',
        immutable: [true, 'JobApplication.model applicantid can\'t be updated'],
        index: true,
        get: (id) => id.toString()
    },
    jobid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'JobApplication.model jobid is required'],
        ref: 'Job',
        immutable: [true, 'JobApplication.model jobid can\'t be updated'],
        index: true,
    },
    status: {
        type: String,
        require: [true, 'JobApplication.model status is required'],
        enum: ['applied', 'accepted', 'rejected', 'in-review'],
        lowercase: true,
        default: 'applied'
    },
    companyid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'JobApplication.model companyid is required'],
        ref: 'Company',
        immutable: [true, 'JobApplication.model companyid can\'t be updated']
    },
    recruiterid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'JobApplication.model recruiterid is required'],
        ref: 'User',
        immutable: [true, 'JobApplication.model recruiterid can\'t be updated']
    }
}, {
    timestamps: true
})

JobApplicationSchema.index({ applicantid: 1, jobid: 1 }, { unique: true })

JobApplicationSchema.methods.toPlainObject = function toPlainObject() {
    const application = this.toObject()

    Object.keys(application).forEach(attribute => {
        if (application[attribute]?.constructor?.name === 'ObjectId')
            application[attribute] = application[attribute].toString()
    })

    return application
}

module.exports = mongoose.model('JobApplication', JobApplicationSchema)