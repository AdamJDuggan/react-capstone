const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    handle: {type: String, required: true, max: 40},
    // switch for skills 
    skills: {type: [String], required: true},
    bio: {type: String},
    // switch for experience-title/company/location/from/to
    goals: [
        {
        title: {type: String, required: true},
        description: {type: String},
        started: {type: Date, required: true, default: Date.now()},
        deadline: {type: Date, required: true}
        },
    ],
    social: {
        youtube: {type: String},
        twitter: {type: String},
        facebook: {type: String},
        instagram: {type: String},
    },
    date: {type: Date, default: Date.now()}
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)