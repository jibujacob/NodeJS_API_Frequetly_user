const routes = require("express").Router();
const {getAllProducts} = require("../controllers/products")

routes.route("/").get(getAllProducts);

module.exports = routes;