const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    title: {type: String, required: true, max: 200},
    descripton: {type: [String], required: true},
    video: {type: String},
    breakdown: [
        {type: String}
    ], 
    date: {type: Date, default: Date.now()},
    // A users posts stay/remain even if user deletes their account. Good for populating at start with dummy accounts
    name:  {type: String},
    avatar: {type: String},
    // I want to link user to the like so can only like once 
    likes: [
       { user: {type: Schema.Types.ObjectId, ref: 'users'} }
    ],
    comments: 
        [
            { 
                user: {type: Schema.Types.ObjectId, ref: 'users'},
                text: {type: String, required: true},
                name:  {type: String},
                avatar: {type: String},
                date: {type: Date, default: Date.now()}
            }
        
        ],
        // Date for post itself! 
        date: {type: Date, default: Date.now()}
})

module.exports = Post = mongoose.model('post', PostSchema)