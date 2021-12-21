const { StatusCodes } = require("http-status-codes");
const {attachCookiesToResponse,createTokenUser} = require("../utils");
const crypto = require("crypto")
const {sendVerificationEmail,sendResetPasswordEmail,createHash} = require("../utils")

const User = require("../models/User")
const Token = require("../models/Token")
const CustomError = require("../errors")

const register = async (req,res) => {
    const {name,email,password} = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if (emailAlreadyExists){
        throw new CustomError.BadRequestError("Email Already Exists")
    }

    const isFirstUser = await User.countDocuments({});
    const role = isFirstUser === 0 ? "admin" : "user";

    //Added below line for the WF update
    const verificationToken = crypto.randomBytes(40).toString("hex");

    const user = await User.create({name,email,password,role,verificationToken});
    const origin = "http://localhost:3000";
    await sendVerificationEmail({name:user.name,
            email:user.email,
            verificationToken:user.verificationToken,
            origin});
    //Commenting below to update workflow of authentication
    // const tokenUser = createTokenUser(user);
    // attachCookiesToResponse({res,user:tokenUser})
    // res.status(StatusCodes.CREATED).json({tokenUser});

    //For Testing
    res.status(StatusCodes.CREATED).json({msg:"Success! Please check your email to verify account"});

}

const verifyEmail = async (req,res) => {
    const {verificationToken,email} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        throw new CustomError.UnauthenticatedError("Verification Failed")
    }

    if(verificationToken!==user.verificationToken){
        throw new CustomError.UnauthenticatedError("Verification Failed")
    }

    user.isVerified=true;
    user.verified=Date.now()
    user.verificationToken=""
    user.save()
    
    res.status(StatusCodes.OK).json({msg:"Email Verified"})
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

    if(!user.isVerified){
        throw new CustomError.UnauthenticatedError("Please verify your email");
    }

    const tokenUser = {name:user.name,id:user._id,role:user.role}
    
    //create refresh token
    let refreshToken = "";

    //check for existing token
    const existingToken = await Token.findOne({user:user._id})
    if(existingToken){
        const {isValid} = existingToken
        if(!isValid){
            throw new CustomError.UnauthenticatedError("Invalid Credentials")
        } 
        refreshToken = existingToken.refreshToken 
        attachCookiesToResponse({res,user:tokenUser,refreshToken}) 
        res.status(StatusCodes.OK).json({user:tokenUser}); 
        return
    }

    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip;
    const userToken = {refreshToken,ip,userAgent,user:user._id}
    await Token.create(userToken)

    attachCookiesToResponse({res,user:tokenUser,refreshToken})
 
    res.status(StatusCodes.OK).json({user:tokenUser});

}

const logout = async (req,res) => {
    console.log(req.user.id);
    await Token.findOneAndDelete({user:req.user.id})
    res.cookie('accessToken','logout',{
        httpOnly:true,
        expire : new Date(Date.now()),
    })
    res.cookie('refreshToken','logout',{
        httpOnly:true,
        expire : new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({msg:"User Logged Out"})
}

const forgotPassword = async (req,res) => {
    const {email} =req.body;
    if (!email){
        throw new CustomError.BadRequestError("Please provide email")
    }

    const user = await User.findOne({email});
    if(user){
        const passwordToken = crypto.randomBytes(70).toString('hex');
        const origin = "http://localhost:3000";
        await sendResetPasswordEmail({name:user.name,email:user.email,token:passwordToken,origin})
        const tenMinutes= 1000 * 60 * 10;
        const passwordTokenExpirationDate = new Date(Date.now()+tenMinutes)

        user.passwordToken=createHash(passwordToken);
        user.passwordTokenExpirationDate=passwordTokenExpirationDate;
        await user.save();
    }
    res.status(StatusCodes.OK).json({msg:"Please check your mail for password reset link"})
}

const resetPassword = async (req,res) => {
    const {token,email,password} = req.body;
    if (!email || !token || !password){
        throw new CustomError.BadRequestError("Please provide email, token and password")
    }

    const user = await User.findOne({email})

    if(user){
        const currentDate = new Date();

        if(user.passwordToken===createHash(token) && user.passwordTokenExpirationDate>currentDate){
            user.password = password;
            user.passwordToken=null;
            user.passwordTokenExpirationDate=null;
            await user.save()
        }
    }
    res.status(StatusCodes.OK).json({msg:"resetPassword"})
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    resetPassword,
    forgotPassword
}