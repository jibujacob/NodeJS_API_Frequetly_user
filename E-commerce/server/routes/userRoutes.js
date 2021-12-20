const routes = require("express").Router();
const {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword} = require("../controllers/userController");

routes.route('/').get(getAllUsers)


module.exports = routes;