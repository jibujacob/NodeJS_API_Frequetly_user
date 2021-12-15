const {StatusCodes} = require("http-status-codes")
const path = require("path");
const cloudinary = require("cloudinary").v2
const fs = require("fs")

const CustomError = require("../errors")

const uploadProductImageLocal = async (req,res) => {

    if(!req.files){
        throw new CustomError.BadRequestError("No File Uploaded")
    }

    const productImage = req.files.image; 

    if(!productImage.mimetype.startsWith("image")){
        throw new CustomError.BadRequestError("Please upload Image")
    }

    const maxSize = 30000

    if(productImage.size > 30000){
        throw new CustomError.BadRequestError(`Please upload Image smaller than ${maxSize}KB`)
    }
    const imagePath = path.join(__dirname,"../public/uploads/" + `${productImage.name}`)
    await productImage.mv(imagePath)
    return res.status(StatusCodes.OK).json({image:{src:`/uploads/${productImage.name}`}})
}

const uploadProductImage = async(req,res)=>{
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath
        ,{use_filename:true,
            folder:"file_upload_node"})
    
    fs.unlinkSync(req.files.image.tempFilePath)
    
    return res.status(StatusCodes.OK).json({image:{src:`${result.secure_url}`}})
}

module.exports ={
    uploadProductImage,
} 