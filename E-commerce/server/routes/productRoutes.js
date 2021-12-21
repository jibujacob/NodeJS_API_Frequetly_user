const routes = require("express").Router();

const {createProduct, getAllProducts,getSingleProduct,
     updateProduct, deleteProduct, uploadImage} = require("../controllers/productController")
const {authenticateUser :authenticateUserMiddleware,
        authorizePermissions:authorizePermissionsMiddleware} = require("../middleware/authentication")
const {getSingleProductReviews} = require("../controllers/reviewController")

routes.route("/").post(authenticateUserMiddleware,authorizePermissionsMiddleware('admin'),createProduct)
                    .get(getAllProducts)
routes.route('/uploadImage').post(authenticateUserMiddleware,authorizePermissionsMiddleware('admin'),uploadImage);
routes.route('/:id').get(getSingleProduct)
                    .patch(authenticateUserMiddleware,authorizePermissionsMiddleware('admin'),updateProduct)
                    .delete(authenticateUserMiddleware,authorizePermissionsMiddleware('admin'),deleteProduct)
routes.route("/:id/reviews").get(getSingleProductReviews)

module.exports = routes