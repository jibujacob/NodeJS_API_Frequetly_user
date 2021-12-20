const { StatusCodes } = require("http-status-codes");
const {attachCookiesToResponse} = require("../utils")

const User = require("../models/User")
const CustomError = require("../errors")

const register = async (req,res) => {
    const {name,email,password} = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if (emailAlreadyExists){
        throw new CustomError.BadRequestError("Email Already Exists")
    }

    const isFirstUser = await User.countDocuments({});
    const role = isFirstUser === 0 ? "admin" : "user";
    const user = await User.create({name,email,password,role});

    const tokenUser = {user:user.name,id:user._id,role:user.role}
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({tokenUser});
}


const login = async (req,res) => {
    res.status(StatusCodes.OK).json({msg:"User Logged In"})
}

const logout = async (req,res) => {
    res.status(StatusCodes.OK).json({msg:"User Logged Out"})
}

module.exports = {
    register,
    login,
    logout,
}