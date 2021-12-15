 const mongoose = require("mongoose")

 const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,"Please provide company name"],
        maxLength:50,
    },
    position:{
        type:String,
        required:[true,"Please provide job position"],
        maxLength:100,
    },
    status:{
        type:String,
        enum:["pending","interview","declined"],
        default:"pending",
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:[true,"Please provide User"]
    }
 },{timestamps:true})

 module.exports = mongoose.model("Job",jobSchema)