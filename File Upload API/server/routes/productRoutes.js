const routes = require("express").Router()
const {createProduct,getAllProducts} = require("../controllers/productController")
const {uploadProductImage} = require("../controllers/uploadsController")

routes.route("/").post(createProduct).get(getAllProducts);
routes.route("/uploads").post(uploadProductImage);

module.exports = routes