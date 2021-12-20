const mongoose = require("mongoose")
const validator = require('validator');
const bcrypt = require("bcryptjs")

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

userSchema.pre('save', async function (next){
    if (!this.isModified('password')) return ;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.comparePassword = async function (candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}
     
module.exports = mongoose.model("User",userSchema);