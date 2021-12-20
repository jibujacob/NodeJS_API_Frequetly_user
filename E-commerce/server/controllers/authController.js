const { StatusCodes } = require("http-status-codes");
const {attachCookiesToResponse,createTokenUser} = require("../utils")

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

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({tokenUser});

}


const login = async (req,res) => {
    
    const {email,password} = req.body;
    if(!email || !password){
        throw new CustomError.BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError("User does not exist");
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        throw new CustomError.UnauthenticatedError("Incorrect Password");
    }

    const tokenUser = {name:user.name,id:user._id,role:user.role}
    attachCookiesToResponse({res,user:tokenUser})

    res.status(StatusCodes.OK).json({tokenUser});

}

const logout = async (req,res) => {
    res.cookie('token','logout',{
        expire : new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg:"User Logged Out"})
}

module.exports = {
    register,
    login,
    logout,
}