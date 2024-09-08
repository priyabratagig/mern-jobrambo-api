const mongoose = require('mongoose')

const AccessSchema = new mongoose.Schema({
    isadmin: {
        type: Boolean,
        require: [true, 'Access.model : isadmin required'],
        default: false,
        immutableimmutable: [true, 'Access.model : isadmin can\'t be updated']
    },
    isblocked: {
        type: Boolean, require: [true, 'Access.model : isblocked required'], default: false
    },
    dashboardvalidity: {
        type: Number, require: [true, 'Access.model : dashboardvalidity required'], default: null
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Access.model : userid is required'],
        unique: [true, 'Access.model : userid already exists'],
        ref: 'User',
        immutable: [true, 'Access.model : userid can\'t be updated'],
        index: true
    }
})

module.exports = mongoose.model('Access', AccessSchema)