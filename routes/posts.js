const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/project1")
const postSchema = new mongoose.Schema({
    postText: {
        type: String,
        
    },
    
    image:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: []
    },
    imgid:{
    type:mongoose.Schema.Types.ObjectId,
    name: String,
    }
});

module.exports = mongoose.model('Post', postSchema);

