const routes = require("express").Router();

const {getAllOrders, getSingleOrder, getCurrentUserOrders,
    createOrder, updateOrder} = require("../controllers/orderController")
const {authenticateUser :authenticateUserMiddleware,
    authorizePermissions:authorizePermissionsMiddleware} = require("../middleware/authentication")

routes.route("/").get(authenticateUserMiddleware,authorizePermissionsMiddleware('admin'),getAllOrders)
                    .post(authenticateUserMiddleware,createOrder)
routes.route('/showAllMyOrders').get(authenticateUserMiddleware,getCurrentUserOrders)
routes.route("/:id").get(authenticateUserMiddleware,getSingleOrder)
                .patch(authenticateUserMiddleware,updateOrder)


module.exports = routes