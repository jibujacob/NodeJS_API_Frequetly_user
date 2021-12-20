//Imports
require("dotenv").config()
require('express-async-errors');
const morgan = require('morgan')
const express = require("express");
const cookieParser = require("cookie-parser")
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler")

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

//Initialization
const app = express();

//Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//Variables
const port = process.env.PORT || 5001;

app.get('/',(req,res)=>{
    // console.log(req.signedCookies);
    res.status(200).json({msg:"Welcome to E-commerce API"});
});

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);

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


