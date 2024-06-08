const jwt = require("jsonwebtoken");

exports.auth = (req,res,next) =>{
    try{
        //fetch token
        const token = req.body.c ||
                      req.header("Authorization").replace("Bearer ", "");

                      console.log(token)
        // token vallidation
        if (!token) {
            return res.status(500).json({
                success: false,
                message: 'token is missing',
            });
        }
        // decode token and add in req.body

        try {
            const decode = jwt.verify(token, process.env.JWT_SERCET);
            console.log(decode)
            req.user = decode;
        }catch(err){
            return res.status(500).json({
                success: false,
                message: 'token is invallied',
            });
        }

    next();
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occerd in auth middlerware"
        })
    }
}

//isBayer
exports.isBayer = async (req,res,next)=>{
    try{
    if(req.user.accountType !== "Buyer"){
        return res.status(401).json({
            success:false,
            message:"this is protuceted routes for Buyer"
        })
    }
    
    next();
    
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
    }

    //isSeller
exports.isSeller = async (req,res,next)=>{
    try{
    if(req.user.accountType !== "Seller"){
        return res.status(401).json({
            success:false,
            message:"this is protuceted routes for Seller"
        })
    }
    
    next();
    
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
    }


    //isBayer
exports.isAdmin = async (req,res,next)=>{
    try{
    if(req.user.accountType !== "Admin"){
        return res.status(401).json({
            success:false,
            message:"this is protuceted routes for Admin"
        })
    }
    
    next();
    
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
    }