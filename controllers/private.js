exports.getPrivateData = (req, res, next) =>{

    return res.status(200).json({
        success: true,
        data: "You git access to the private data in this route"
    })
    
}