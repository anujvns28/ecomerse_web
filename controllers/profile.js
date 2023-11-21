const profile = require("../models/profile");
const user = require("../models/user");


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
        const userData = await user.findById(userId).populate("additionalInfo").exec()
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