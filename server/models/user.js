const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token:{
            type: String,
            require: true
        }
    }]
});

module.exports = { User }