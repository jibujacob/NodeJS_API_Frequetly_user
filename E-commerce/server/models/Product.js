const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"Please provide Product name"],
        maxlength:[100,"Name cannot be more than 100 characters"]
    },
    price:{
        type:Number,
        required:[true,"Please provide Product price"],
        default:0
    },
    description:{
        type:String,
        required:[true,"Please provide Product name"],
        maxlength:[1000,"Name cannot be more than 1000 characters"]
    },
    image:{
        type:String,
        default:"/uploads/sample.jpeg",
    },
    category:{
        type:String,
        required:[true,"Please provide Product category"],
        enum:['office','kitchen','bedroom']
    },
    company:{
        type:String,
        required:[true,"Please provide Product company"],
        enum:{
           values: ['ikea','liddy','marcos'],
           message:"{VALUE} is not supported",
        }
    },
    colors:{
        type:[String],
        required:true,
        default:['#222']
    },
    featured:{
        type:Boolean,
        default:false,
    },
    freeShipping:{
        type:Boolean,
        default:false,
    },
    inventory:{
        type:Number,
        required:true,
        default:15,
    },
    averageRating:{
        type:Number,
        default:0,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:[true,"Please provide User"]
    }
},{timestamps:true})

module.exports = mongoose.model("Product",productSchema);