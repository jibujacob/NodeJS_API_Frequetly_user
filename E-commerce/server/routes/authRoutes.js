const routes = require("express").Router();
const {register,login,logout} = require("../controllers/authController");


routes.route("/register").post(register);
routes.route("/login").post(login);
routes.route("/logout").get(logout);

module.exports = routes;