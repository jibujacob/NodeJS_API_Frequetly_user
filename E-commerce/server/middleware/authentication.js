const CustomError = require("../errors")
const {isTokenValid} = require("../utils")

const authenticateUser = (req,res,next) => {
    const token = req.signedCookies.token;
    if(!token){
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
    try {
        const {name,id,role} = isTokenValid({token});
        req.user = {name,id,role}
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