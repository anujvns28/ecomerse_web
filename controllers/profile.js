const profile = require("../models/profile");
const user = require("../models/user");
const { uploadImageToCloudinary } = require("../utilit/imageUploader");
const Address = require("../models/address")


exports.getUserData = async(req,res) =>{
    try{
        //fetching data 
        const {userId} = req.body;

        // valladiton
        if(!userId){
            return res.status(500).json({
                success : false,
                message:"UserID is required"
            })  
        }
        // check user is vallied or not
        const userData = await user.findById(userId).populate("additionalInfo").populate("address").exec()
        console.log("userData",userData)

        if(!userData){
            return res.status(500).json({
                success : false,
                message:"Your not vallied user"
            })    
        }

        return res.status(200).json({
            success:true,
            message:"user Data fetch successfully",
            data : userData
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in fatching user data"
        })
    }
}

exports.updateProfile = async(req,res) =>{
    try{
        const { firstName,lastName,userId, gender=null,dateOfBirth = null,about= null,contactNumber=null} = req.body;
        // validation  
        console.log(firstName,lastName,userId,"this is data")
        if (!userId || !firstName || !lastName ) {
            return res.status(500).json({
                success: false,
                message: 'all fileds required'
            })
        }
        const userData = await user.findById(userId).populate("additionalInfo").exec();
        const profileID = userData.additionalInfo._id

        const updateProfile = await profile.findByIdAndUpdate(profileID,{
            gender:gender,
            dateOfBirth:dateOfBirth,
            about:about,
            contactNumber:contactNumber
        },
        {new:true})

        const updateUser = await user.findByIdAndUpdate(userId,{
            firstName:firstName,
            lastName:lastName
        },{new:true})

        return res.status(200).json({
            success:true,
            message:"profile update suceesfully",
            data:updateProfile,
            userData:updateUser
        })


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in updating profile  data"
        })
    }
}



exports.updateProfileImg  = async(req,res) =>{
    try{
    // fetchig image url
    const {userId} = req.body;
    const image = req.files.profileImage;

    console.log(req.body,req.files.profileImage)

    if(!userId){
        return res.status(400).json({
            success:false,
            message:"UserId is required"
        })
    }

    const userData = await user.findById(userId);
    
    if(!userData){
        return res.status(400).json({
            success:false,
            message:"You are not vallid user"
        }) 
    }

    const imageUrl = await uploadImageToCloudinary(image)

    const updateImg = await user.findByIdAndUpdate(userId,{
        image:imageUrl.secure_url
    },{new:true});
    
   console.log(updateImg)
   
   return res.status(200).json({
    success:true,
    message:"profile img  updated suceesfully",
    data:updateImg,
})

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in updating profile image "
        }) 
    }
}


exports.addAddress = async(req,res) =>{
    try{
    //fetching data
    const {userId,name,phoneNumber,pincode,city,state,locality,address,alternatePhoneNumber=null,landmark} = req.body;
    //vallidation
    if(!userId ||!name || !phoneNumber || !pincode || !city || !state || !locality ||!address || !landmark ){
        return res.status(400).json({
            success:false,
            message:"all filds are required"
        })
    }

    const userData = await user.findById(userId);
    
    if(!userData){
        return res.status(400).json({
            success:false,
            message:"You are not vallid user"
        }) 
    }

    const addressId = userData.address._id;

    const addAddress = await Address.findByIdAndUpdate(addressId,{
        name:name,
        phoneNumber:phoneNumber,
        pincode:pincode,
        locality:locality,
        address:address,
        city:city,
        state:state,
        landmark:landmark,
        alternatePhoneNumber:alternatePhoneNumber
    },{new:true})

    console.log(addAddress,"this is address")
   
   return res.status(200).json({
    success:true,
    message:" address added suceesfully",
    data:addAddress,
})



    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in adding address"
        })    
    }
}


exports.deleteAddress = async(req,res) =>{
    try{
        const {userId} = req.body;

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"UserId is required"
            })
        }
    
        const userData = await user.findById(userId);
        
        if(!userData){
            return res.status(400).json({
                success:false,
                message:"You are not vallid user"
            }) 
        }

        const addressId = userData.address._id;

       await Address.findByIdAndDelete(addressId);

       await user.findByIdAndUpdate(userId,{
        $pull:{
            address : addressId
        }
       },{new:true})

       return res.status(200).json({
        success:true,
        message:"address deletead successfully"
    })
    
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message:"Error occuring in deleting  address"
        })    
    }
}