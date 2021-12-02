exports.register = (req, res, next) => {
    res.send("Register...");
}

exports.login = (req, res, next) => {
    res.send("Login...");
}

exports.forgotPassword = (req, res, next) => {
    res.send("Forgot Pass...");
}

exports.resetPassword = (req, res, next) => {
    res.send("Reset Pass...");
}

