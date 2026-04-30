const mongoose = require('mongoose');
const {Schema,model} = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
    role:{
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
},
{ timestamps: true }
);

const User = model('User', UserSchema);
module.exports = User;