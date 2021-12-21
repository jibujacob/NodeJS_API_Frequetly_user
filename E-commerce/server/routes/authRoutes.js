const routes = require("express").Router();
const {register,login,logout,verifyEmail,forgotPassword,resetPassword} = require("../controllers/authController");

const {authenticateUser :authenticateUserMiddleware} = require("../middleware/authentication")


routes.route("/register").post(register);
routes.route("/login").post(login);
routes.route("/logout").delete(authenticateUserMiddleware,logout);
routes.route("/verify-email").post(verifyEmail);
routes.route("/forgot-password").post(forgotPassword)
routes.route("/reset-password").post(resetPassword)

module.exports = routes; 