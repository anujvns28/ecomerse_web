const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var subCategory = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]
});

//Export the model
module.exports = mongoose.model('SubCategory', subCategory);