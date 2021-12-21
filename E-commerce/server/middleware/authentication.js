const CustomError = require("../errors")
const {isTokenValid} = require("../utils")
const Token = require("../models/Token")
const { attachCookiesToResponse} = require("../utils")

const authenticateUser = async (req,res,next) => {
    const {refreshToken,accessToken} = req.signedCookies;
    try {
        if(accessToken){
            const payload = isTokenValid(accessToken);
            req.user=payload.user
            return next()
        }
        const payload = isTokenValid(refreshToken);
        const existingToken = await Token.findOne({user:payload.user.id,refreshToken:payload.refreshToken})
        if(!existingToken || !existingToken?.isValid){
            throw new CustomError.UnauthenticatedError("Authentication Invalid")
        }
    attachCookiesToResponse({res,user:payload.user,refreshToken:payload.refreshToken});
    req.user=payload.user;
    next();
    } catch (error) {
        
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
}

const authorizePermissions = (...roles) => {
    return(req,res,next) => {
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthorizedError("Unauthorized access to the route")
        }
        next();
    }
    
}

module.exports = {
    authenticateUser,
    authorizePermissions
}