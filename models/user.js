const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
firstName:{
    type:String,
    required:true,
    trim:true
},
lastName:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    trim:true
},
password:{
    type:String,
    required:true,
    trim:true
},
token:{
   type:String,
},
additionalInfo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Profile"
},
image:{
    type:String
},
accountType:{
    type:String,
    enum:["Buyer", "Seller","Admin"],
    required:true
},
products:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product"
}]
})

module.exports = mongoose.model("User",userSchema)