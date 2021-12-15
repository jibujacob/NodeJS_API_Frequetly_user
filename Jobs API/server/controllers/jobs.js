const {StatusCodes} = require("http-status-codes")
const Job = require("../models/Job") 
const {NotFoundError,BadRequestError} = require("../errors/index")

const getAllJobs = async(req,res)=>{
    const jobs = await Job.find({createdBy:req.user.userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({jobs})
}

const getJob = async(req,res)=>{    
   const {user:{userId},params:{id:jobId}} = req
   const job = await Job.findOne({createdBy:userId,_id:jobId})

   console.log(job);
   if (!job){
       throw new NotFoundError(`No job with id ${jobId} found`)
   }
   res.status(StatusCodes.OK).json({job})
}

const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res)=>{
    const {user:{userId},
            params:{id:jobId},
            body:{company,position}
            } = req

    if(company  === '' || position === ''){
        throw new BadRequestError("Company and Position fields cannot be empty")
    }        
    const job = await Job.findOneAndUpdate({createdBy:userId,_id:jobId},req.body,{new:true,runValidators:true})

    if(!job){
        throw new NotFoundError(`No job with id ${jobId} found`)
    }

    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async(req,res)=>{
    const {user:{userId},
            params:{id:jobId}
            } = req

    const job = await Job.findOneAndDelete({createdBy:userId,_id:jobId})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId} found`)
    }

    res.status(StatusCodes.OK).send()
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} 