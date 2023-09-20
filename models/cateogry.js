const mongoose = require("mongoose");

const categoryShema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    categoryDes:{
        type:String,
        require:true
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]
})

module.exports = mongoose.model("Cateogry",categoryShema)