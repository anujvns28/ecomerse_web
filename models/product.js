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
    productsImages:[{
        type:String,
        required:true
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"SubCategory",
    },
    
})

module.exports = mongoose.model("Product",productSchema)