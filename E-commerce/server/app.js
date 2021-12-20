//Imports
require("dotenv").config()
require('express-async-errors');
const morgan = require('morgan')
const express = require("express");
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")

const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler")

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
//Initialization
const app = express();

//Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"))
app.use(fileUpload())
//Variables
const port = process.env.PORT || 5001;

app.get('/',(req,res)=>{
    // console.log(req.signedCookies);
    res.status(200).json({msg:"Welcome to E-commerce API"});
});

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=> console.log(`Server is listening on port ${port}...`));
        console.log('E-Commerce API');
    } catch (error) {
        console.log(error);
    }
}

start();


