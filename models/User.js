const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// pre saving actions
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// methods defining for selected user schema
UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", UserSchema);

module.exports = User;