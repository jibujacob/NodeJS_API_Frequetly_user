const CustomError = require("../errors")

const checkPermissions = (requestUser,resourceUserId) => {
    if(requestUser.role === 'admin') return ;
    console.log(requestUser.id);
    console.log(resourceUserId.toString());
    console.log(requestUser,resourceUserId);
    if(requestUser.id !== resourceUserId.toString()) throw new CustomError.UnauthorizedError("Not authorized to this route");
}

module.exports=checkPermissions;