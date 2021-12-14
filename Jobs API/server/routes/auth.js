const routes = require("express").Router()
const {register,login} = require("../controllers/auth")

routes.route("/register").post(register);
routes.route("/login").post(login);

module.exports = routes