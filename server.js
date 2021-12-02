require("dotenv").config({path: "./config.env"});

const express = require("express");
const app = express();

// middlewares
app.use(express.json());  // allow to get data from json body

app.use('/api/auth', require('./routes/auth')); // map the auth route from the server

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`));