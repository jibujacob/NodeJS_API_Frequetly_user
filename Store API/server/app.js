require("dotenv").config()
require("express-async-errors")

const notFoundMiddleware = require("./middleware/not-found")
const errorMiddleware = require("./middleware/error-handler")
const express = require("express"); 
const errorHandlerMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect")
const products = require("./routes/products")

const app = express();


//middleware
app.use(express.json())

//routes
app.get("/",(req,res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

//product routes
app.use("/api/v1/products",products);

//
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5001;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>console.log("Server up and Running"));
    } catch (error) {
        console.log(error);
    }
}


start()