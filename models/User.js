const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please provide a username"]
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Invalid email"]
    },
    password:{
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false // security conditions
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

const User = mongoose.model("User", UserSchema);

module.exports = User;