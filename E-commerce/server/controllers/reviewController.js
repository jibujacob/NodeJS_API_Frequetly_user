const {StatusCodes} = require("http-status-codes")
const Review = require("../models/Review")
const Product = require("../models/Product")
const CustomError = require("../errors")
const {checkPermissions} = require("../utils")

const createReview = async(req,res)=>{
    const {product:productId} = req.body
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new CustomError.NotFoundError(`Product not found with id:${productId}`)
    }

    const alreadySubmitted = await Review.findOne({user:req.user.id,product:productId})
    if(alreadySubmitted){
        throw new CustomError.BadRequestError("User already submitted review for this product")
    }

    req.body.user = req.user.id;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({review})
}

const getAllReviews = async(req,res)=>{
    const reviews = await Review.find({})
                    .populate({path:'product',select:"name company price"})
                    .populate({path:'user',select:"name"})
    res.status(StatusCodes.OK).json({count:reviews.length,reviews})
}

const getSingleReview = async(req,res)=>{
    const review = await Review.findOne({_id:req.params.id});
    if(!review){
        throw new CustomError.NotFoundError(`Review not found for id:${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({review})
}

const updateReview = async(req,res)=>{
    const {rating,title,comment} = req.body;

    const review = await Review.findOne({_id:req.params.id});
    if(!review){
        throw new CustomError.NotFoundError(`Review not found for id:${req.params.id}`) 
    }
    checkPermissions(req.user,review.user)
    review.rating=rating;
    review.title=title;
    review.comment=comment;
    await review.save();

    res.status(StatusCodes.OK).json({review})
}

const deleteReview = async(req,res)=>{
    const review = await Review.findOne({_id:req.params.id});
    if(!review){
        throw new CustomError.NotFoundError(`Review not found for id:${req.params.id}`) 
    }
    checkPermissions(req.user,review.user)
    await review.remove();
    res.status(StatusCodes.OK).json({msg:`Review ${req.params.id} removed successfully`})
}


module.exports = {
    createReview, getAllReviews, getSingleReview, updateReview, deleteReview
}