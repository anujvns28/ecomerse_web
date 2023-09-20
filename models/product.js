const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productDes:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    productsImage:[{
        type:String,
        required:true
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    
})

module.exports = mongoose.model("Product",productSchema)