const routes = require("express").Router()
const {login,dashboard} = require("../controllers/main")
const authMiddleware = require("../middleware/auth")

routes.route("/dashboard").get(authMiddleware,dashboard)
routes.route("/login").post(login)

module.exports = routes