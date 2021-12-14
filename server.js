require("dotenv").config({path: "./config.env"});
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// connect the database
connectDB(); 

const app = express();

// middlewares
app.use(express.json());  // allow to get data from json body

app.use('/api/auth', require('./routes/auth')); // map the auth route from the server
app.use('/api/private', require('./routes/private'));

app.use(errorHandler); // should be last peice of middleware

const PORT = process.env.PORT || 4000;


const server = app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`));



// unhandled rejection management
process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error : ${err}`);
    server.close(()=> process.exit(1));
})