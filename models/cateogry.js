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
    subCategorys:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubCategory"
    }]
})

module.exports = mongoose.model("Cateogry",categoryShema)