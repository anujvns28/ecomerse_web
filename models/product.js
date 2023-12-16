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
    mainImage:{
        type:String,
        required:true
    },
    forWhom :{
       type:String,
       required:true
    },
    color:{
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
    },
    customor:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
    
})

module.exports = mongoose.model("Product",productSchema)

