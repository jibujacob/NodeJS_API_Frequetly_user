const routes = require("express").Router();
const {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword} = require("../controllers/userController");
const {authenticateUser :authenticateUserMiddleware,authorizePermissions:authorizePermissionsMiddleware} = require("../middleware/authentication")

routes.route('/').get(authenticateUserMiddleware,authorizePermissionsMiddleware('admin'),getAllUsers);
routes.route('/showMe').get(authenticateUserMiddleware,showCurrentUser);
routes.route('/updateUser').patch(authenticateUserMiddleware,updateUser);
routes.route('/updateUserPassword').post(authenticateUserMiddleware,updateUserPassword);
routes.route('/:id').get(authenticateUserMiddleware,getSingleUser);

module.exports = routes;