const mongoose = require("mongoose")
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Must pass User Name"],
        minLength:3,
        maxLength:50,
    },
    email:{
        type:String,
        required:[true,"Must pass User Email"],
        unique:true,
        validate:{
            validator: validator.isEmail,
            message:"Please enter valid mail"
        }
    },
    password:{
        type:String,
        required:[true,"Please provide password"],
        minLength:6,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
    }
})

module.exports = mongoose.model("User",userSchema);