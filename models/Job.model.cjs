const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job.model title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job.model description is required'],
        trim: true
    },
    requirements: {
        type: String,
        required: [true, 'Job.model requirements is required'],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, 'Job.model salary is required'],
        min: [1, 'Job.model salary as LPA, 1 LPA'],
        index: true
    },
    location: {
        type: String,
        required: [true, 'Job.model location is required'],
        trim: true,
        index: true
    },
    type: {
        type: String,
        required: [true, 'Job.model type is required'],
        trim: true,
        lowercase: true,
        index: true
    },
    experience: {
        type: String,
        required: [true, 'Job.model experience is required'],
        trim: true
    },
    positions: {
        type: Number,
        required: [true, 'Job.model positions is required'],
        min: [1, 'Job.model minimum open position(s) 1']
    },
    companyid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Job.model companyid is required'],
        ref: 'Company',
        immutable: [true, 'Job.model companyid can\'t be updated'],
        index: true
    },
    recruiterid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Job.model recruiterid is required'],
        ref: 'User',
        immutable: [true, 'Job.model recruiterid can\'t be updated'],
        index: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Job', JobSchema)