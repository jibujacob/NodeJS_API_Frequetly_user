const Task = require("../models/task")
const asyncWrapper = require("../middleware/async")
const {createCustomError} = require("../errors/custom-errors")

const getAllTasks = asyncWrapper(async (req,res) => {
    const tasks = await Task.find({})
    res.status(200).json({tasks})
})

const createTask = asyncWrapper(async (req,res) =>{
    const task = await Task.create(req.body)
    res.status(201).json({task})      
})

const getTask = asyncWrapper(async (req,res,next) =>{
    const {taskId} = req.params
    const task = await Task.findOne({_id:taskId})
    if (!task){
        return next(createCustomError(`No task with the id:${taskId}`,404))
    }
    res.status(200).json({task})
})

const updateTask = asyncWrapper(async (req,res,next) =>{
    const {taskId} = req.params
    const task = await Task.findOneAndUpdate({_id:taskId},req.body,{new:true,runValidators:true})
    if (!task){
        return next(createCustomError(`No task with the id:${taskId}`,404))
    }
    
    res.status(200).json({task})
})

const deleteTask = asyncWrapper(async(req,res,next) =>{
    const {taskId} = req.params
    const task = await Task.findOneAndDelete({_id:taskId})
    console.log(task);
    if (!task){
        return next(createCustomError(`No task with the id:${taskId}`,404))
    }
    res.status(200).json({msg:`Task ${taskId} is deleted successfully`})
})

module.exports={
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
}
