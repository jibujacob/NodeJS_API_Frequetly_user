//Imports
require("dotenv").config()
require('express-async-errors');
const morgan = require('morgan')
const express = require("express");
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler")

const authRoutes = require("./routes/authRoutes");

//Initialization
const app = express();

//Middleware
app.use(morgan("tiny"))
app.use(express.json());

//Variables
const port = process.env.PORT || 5001;

app.get('/',(req,res)=>{
    res.status(200).json({msg:"Welcome to E-commerce API"});
});

app.use("/api/v1/auth",authRoutes);

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


