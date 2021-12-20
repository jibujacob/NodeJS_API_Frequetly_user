const CustomError = require("../errors")

const checkPermissions = (requestUser,resourceUserId) => {
    if(requestUser.role === 'admin') return ;
    if(requestUser.id !== resourceUserId.toString()) throw new CustomError.UnauthorizedError("Not authorized to this route");
}

module.exports=checkPermissions;