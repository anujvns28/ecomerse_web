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
    productMainImage:{
        type:String,
        required:true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"SubCategory",
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cateogry"
    }
    
})

module.exports = mongoose.model("Product",productSchema)

