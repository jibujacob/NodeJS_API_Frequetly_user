const { StatusCodes } = require("http-status-codes");
const User = require("../models/User")
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse,checkPermissions } = require("../utils");

const getAllUsers = async (req,res) => {
    const users = await User.find({role:"user"}).select("-password")
    res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async (req,res) => {
    const user = await User.findOne({_id:req.params.id }).select("-password")
    if(!user){
        throw new CustomError.NotFoundError(`User with ${req.params.id} does not exists`)
    }
    checkPermissions(req.user,user._id)
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async (req,res) => {
    res.status(StatusCodes.OK).json({user:req.user})
}

const updateUser = async (req,res) => {
    const {name,email} = req.body;

    if (!name || !email){
        throw new CustomError.BadRequestError("Please provide name and email")
    }

    const user = await User.findOneAndUpdate({_id:req.user.id},{email,name},{new:true,runValidators:true});
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({tokenUser})
}

const updateUserPassword = async (req,res) => {
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError("Please provide old and new password");
    }

    const user = await User.findOne({_id:req.user.id});
    const isOldPasswordMatch = await user.comparePassword(oldPassword);
    if(!isOldPasswordMatch){
        throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg:"Success! Password Updated"})
}


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}