const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    bio: {
        type: String,
        required: [true, 'Profile.model : bio is required'],
        default: 'Student',
        trim: true
    },
    skills: {
        type: [String], required: [true, 'Profile.model : skills is required'], default: []
    },
    resume: {
        type: String,
        required: [true, 'Profile.model : resume is required'],
        default: null,
        trim: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Profile.model : userid is required'],
        unique: [true, 'Profile.model : userid already exists'],
        ref: 'User',
        immutable: [true, 'Profile.model : userid can\'t be updated'],
        index: true
    }
})

module.exports = mongoose.model('Profile', ProfileSchema)