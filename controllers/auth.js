const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../config/email");
const crypto = require("crypto");

exports.register = async(req, res, next) => {
    
    const {username, email, password} = req.body;

    try {
        const  user = await User.create({
            username, email, password
        });
        
        sendToken(user, 201, res);

    } catch (error) {
        next(error);
    }
}

exports.login = async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse("Please provide valid email and password", 400));
    }

    try {
        const user = await User.findOne({email}).select("+password");

        if(!user){
            return next(new ErrorResponse("Invalid credintials", 401)); 
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new ErrorResponse("Invalid credintials", 401));
        }

        sendToken(user, 200, res);

    } catch (error) {

        next(error);
    }

}

exports.forgotPassword = async (req, res, next) => {
   const {email} = req.body;

   try {
       const user = await User.findOne({email});
       
       if(!user){
           return next(new ErrorResponse("Email could not be sent", 404));
       }

       const resetToken = user.getResetPasswordToken();

       await user.save();

       const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
       const message = `
       <h1>You have requested a password reset</h1>
       <p>Please go to this link to reset your password</p>
       <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
       `

       try {
           await sendEmail(user.email, message, "Password Reset");
           res.status(200).json({success: true, data: "Email sent"});

       } catch (error) {
           user.resetPasswordToken = undefined;
           user.resetPasswordExpire = undefined;

           await user.save();

           return next(new ErrorResponse("Email could not be sent", 500));
       }

   } catch (error) {

       next(error);
   }
}

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        
        const user = await User.findOne({resetPasswordToken, resetPasswordExpire:{$gt: Date.now()}});
        if (!user) {
            return next(new ErrorResponse("Invalid reset token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password reset success"
        })
        
    } catch (error) {
        next(error);
    }
}


// util functions
const sendToken = (user, statusCode, res) =>{
    const token = user.getSignedToken();
    return res.status(statusCode).json({
        success: true,
        token
    })
}
