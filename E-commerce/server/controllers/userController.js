const { StatusCodes } = require("http-status-codes");
const User = require("../models/User")

const getAllUsers = (req,res) => {
    res.status(StatusCodes.OK).json({msg:"All Users"})
}

const getSingleUser = (req,res) => {
    res.status(StatusCodes.OK).json({msg:"Single User"})
}

const showCurrentUser = (req,res) => {
    res.status(StatusCodes.OK).json({msg:"Current User"})
}

const updateUser = (req,res) => {
    res.status(StatusCodes.OK).json({msg:"Update User"})
}

const updateUserPassword = (req,res) => {
    res.status(StatusCodes.OK).json({msg:"Update User Password"})
}


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}