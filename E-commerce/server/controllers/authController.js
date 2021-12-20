const User = require("../models/User")


const register = async (req,res) => {
    res.status(200).json({msg:"User Registered"})
}

const login = async (req,res) => {
    res.status(200).json({msg:"User Logged In"})
}

const logout = async (req,res) => {
    res.status(200).json({msg:"User Logged Out"})
}

module.exports = {
    register,
    login,
    logout,
}