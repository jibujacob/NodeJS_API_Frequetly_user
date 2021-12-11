//Imports
const {connectDB} = require("./db/connect")
const express = require("express");
const tasks = require("./routes/tasks")
const notFound = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")
require("dotenv").config()

//Initialization
const app = express();
const port = process.env.PORT || 5001;

//Middleware
app.use(express.static("./public"))
app.use(express.json())

//Routes
app.use("/api/v1/tasks",tasks);

app.use(notFound)
app.use(errorHandlerMiddleware)

const startServer = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        //Listen
        app.listen(port,()=>console.log("Connected to server"));
    } catch (error) {
        console.log(error);
    }
}

startServer()