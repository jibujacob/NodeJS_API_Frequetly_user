const express = require("express")
const routes = express.Router()
const { getAllTasks,createTask,getTask,updateTask,deleteTask} = require("../controllers/tasks")

routes.route("/").get(getAllTasks).post(createTask);
routes.route("/:taskId").get(getTask).patch(updateTask).delete(deleteTask);

module.exports = routes