const {StatusCodes} = require("http-status-codes")
const Order = require("../models/Order")
const Product = require("../models/Product")
const CustomError = require("../errors")
const {checkPermissions} = require("../utils")
const { findOne } = require("../models/Order")

const fakeStripeAPI = async ({amount,currency}) => {
    const clientSecret = "someRandomValue"
    return {clientSecret,amount}
}

const createOrder = async (req,res) => {
    const {cartItems,tax,shippingFee} = req.body;
    if(!cartItems || cartItems.length < 1){
        throw new CustomError.BadRequestError("No cart items provided")
    }
    if(!tax || !shippingFee){
        throw new CustomError.BadRequestError("No shipping fee and tax provided")
    }

    let orderItems = [];
    let subTotal =0;

    for (const item of cartItems){
        const dbProduct = await Product.findOne({_id:item.product})
        if(!dbProduct){
            throw new CustomError.NotFoundError(`Product ${item.product} not found`)
        }

        const {name,price,image,_id} = dbProduct;
        console.log(name,price,image);
        const singleOrder = {
            amount:item.amount,
            name,price,image,
            product:_id
        }

        orderItems = [...orderItems,singleOrder]
        subTotal+= (item.amount * price)
    }

    const total = tax + shippingFee + subTotal;

    //fake payment setup
    const paymentIntent = await fakeStripeAPI({
        amount:total,
        currency: 'usd',
    })

    const order = await Order.create({
        orderItems,
        total,
        subTotal,
        tax,
        shippingFee,
        clientSecret:paymentIntent.clientSecret,
        user:req.user.id
    })

    res.status(StatusCodes.OK).json({order,clientSecret:order.clientSecret})
}

const getAllOrders = async (req,res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders})
}

const getSingleOrder = async (req,res) => {
    const {id:orderId} = req.params;
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError(`Order ${orderId} not found`)
    }

    checkPermissions(req.user,order.user);
    res.status(StatusCodes.OK).json({order});
}

const getCurrentUserOrders = async (req,res) => {
    const orders = await Order.find({user:req.user.id})
    res.status(StatusCodes.OK).json({orders})
}

const updateOrder = async (req,res) => {
    const {id:orderId} = req.params;
    const{paymentId} = req.body;

    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError(`Order ${orderId} not found`)
    }

    checkPermissions(req.user,order.user);

    order.paymentId=paymentId 
    order.status="paid";
    await order.save();
    res.status(StatusCodes.OK).json({order})
}

module.exports ={
    getAllOrders, 
    getSingleOrder, 
    getCurrentUserOrders,
    createOrder, 
    updateOrder
}