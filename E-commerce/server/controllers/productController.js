const {StatusCodes} = require("http-status-codes")
const path = require("path")

const Product = require("../models/Product")
const CustomErrors = require("../errors");

const createProduct = async (req,res) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});
}

const getAllProducts = async (req,res)   => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({count:products.length,products});
}

const getSingleProduct = async (req,res) => {
    const product = await Product.findOne({_id:req.params.id})
                                    .populate("reviews");
    if(!product){
        throw new CustomErrors.NotFoundError(`Product with id ${req.params.id} not found`)
    }
    res.status(StatusCodes.OK).json({product});
}

const updateProduct = async (req,res) => {
    const productUpdated = await Product.findOneAndUpdate({_id:req.params.id},
                                            req.body,{
                                                new:true,
                                                runValidators:true,
                                            })
    if(!productUpdated){
        throw new CustomErrors.NotFoundError(`Product with id ${req.params.id} not found`)
    }
    res.status(StatusCodes.OK).json({productUpdated});
}

const deleteProduct = async (req,res) => {
    const product = await Product.findOne({_id:req.params.id})
    if(!product){
        throw new CustomErrors.NotFoundError(`Product with id ${req.params.id} not found`)
    } 

    await product.remove();
    res.status(StatusCodes.OK).json({msg:`Product id ${req.params.id} deleted`});
}

const uploadImage = async (req,res) => {
    if(!req.files){
        throw new CustomErrors.BadRequestError("No files Uploaded")
    }

    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith("image")){
        throw new CustomErrors.BadRequestError("Please upload an image")
    }

    const maxSize = 1024 * 1024;
    if(productImage.size > maxSize){
        throw new CustomErrors.BadRequestError("Please upload image smaller than 1MB")
    }

    const imagePath = path.join(__dirname,"../public/uploads/"+`${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK ).json({image:`/uploads/${productImage.name}`});
}

module.exports={
    createProduct, 
    getAllProducts,
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    uploadImage}