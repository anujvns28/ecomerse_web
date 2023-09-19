const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
phoneNumber:{
    type:Number
},
gender:{
    type:String
},
about:{
    type:String
},
DateofBirth:{
    type:Date
}
})

module.exports = mongoose.model("Profile",profileSchema)