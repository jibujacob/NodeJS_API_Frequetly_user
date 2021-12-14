const routes = require("express").Router()
const {getAllJobs,getJob,createJob,updateJob,deleteJob} = require("../controllers/jobs")

routes.route("/").get(getAllJobs).post(createJob);
routes.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = routes