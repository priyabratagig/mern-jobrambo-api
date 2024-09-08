const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    isrecruiter: {
        type: Boolean,
        require: [true, 'User.model : isrecruiter required'],
        immutable: [true, 'User.model : isrecruiter can\'t be updated'],
        default: false
    },
    fullname: {
        type: String, required: [true, 'User.model : fullname is required'], trim: true
    },
    phonenumber: {
        type: String,
        required: [true, 'User.model : phonenumber is required'],
        unique: [true, 'User.model : phonenumber already exists'],
        trim: true,
        match: [/^\d{10}$/, 'User.model : phonenumber should be 10 digits']
    },
    email: {
        type: String,
        required: [true, 'User.model : email is required'],
        unique: [true, 'User.model : email already exists'],
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String, required: [true, 'User.model : password is required']
    }
})

module.exports = mongoose.model('User', UserSchema)