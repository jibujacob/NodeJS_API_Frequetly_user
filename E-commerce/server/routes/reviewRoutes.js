const routes = require("express").Router();

const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview} = require("../controllers/reviewController")
const {authenticateUser :authenticateUserMiddleware} = require("../middleware/authentication")

routes.route("/").post(authenticateUserMiddleware,createReview)
                    .get(getAllReviews)
routes.route('/:id').get(getSingleReview)
                    .patch(authenticateUserMiddleware,updateReview)
                    .delete(authenticateUserMiddleware,deleteReview)



module.exports = routes