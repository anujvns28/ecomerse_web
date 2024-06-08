const otpGenerator = require("otp-generator");
const User = require("../models/user");
const Otp = require("../models/otp")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require("../utilit/emalSender");
const Profile = require("../models/profile");
const Address = require("../models/address");
const crypto = require("crypto");

exports.sendOtp = async (req, res) => {
    try {
        
        // fetching data
        const { email } = req.body;
        //vallidation
        if (!email) {
            return res.status(500).json({
                success: false,
                message: "email is required"
            })
        }
        //is email alredy rejustered or not
        const isUserExist = await User.findOne({ email: email });
        

        if (!isUserExist) {

            let otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            })

            let result = await Otp.findOne({ otp: otp });
            
            while (result) {
                otp = otpGenerator.generate(6, {
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false
                })
                result = await Otp.find({ otp: otp });
            }
            console.log(otp)
            const otpPayload = { email, otp };

            await Otp.create(otpPayload);
           
            //sending mail
            sendMail(email,"Otp varifaction from eserver",otp)
            
            return res.status(200).json({
                success: true,
                message: "otp send succefully",
                otpbody: otpPayload
            })
        }

        return res.status(500).json({
            success: false,
            message: "user is already rejustered"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in sending otp",
        })
    }
}

// signup 

exports.signup = async (req, res) => {
    try {
        console.log("sendotp me svagat hai")
        //fetching data
        console.log(req.body,"this is form signup data")
        const { email, firstName, lastName, password, confirmPassword, otp, accountType } = req.body;
        // validation
        if (!email || !firstName || !lastName || !password || !confirmPassword || !otp || !accountType) {
            return res.status(500).json({
                success: false,
                message: 'all fileds required hai ji'
            })
        }
        //match passwords 
        if (password !== confirmPassword) {
            return res.status(500).json({
                success: false,
                message: "password are not matching"
            })
        }
        //check user alredy rejustered or not
        const isUserExist = await User.findOne({ email: email });
        if (isUserExist) {
            return res.status(500).json({
                success: false,
                message: "User is already resjustered"
            })
        }

        //otp vallidation
        const resentOtp = await Otp.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);
        
        if (otp !== resentOtp.otp) {
            return res.status(500).json({
                success: false,
                message: "otp is not matching , try agian"
            })
        }
        console.log("rcent otp",resentOtp)
        
        //hasing password
        const hasedPassword = await bcrypt.hash(password, 10)

         // additional info
       const profilePayload = {
        gender:null,
        contactNumber:null,
        dateOfBirth:null,
        about:null
      }

     const profile = await Profile.create(profilePayload);

        const userPayload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            accountType: accountType,
            password: hasedPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
            additionalInfo : profile._id
        }

        // creading data in deb
        const user = await User.create(userPayload);
       
        console.log(userPayload)
        return res.status(200).json({
            success: true,
            message: "entry created",
            data: user,

        })
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in sending resustring user",
        })
    }
}

// loging 
exports.login = async (req, res) => {
    try {
        // fetching data
        const { email, password } = req.body;
        //valildation
        if (!email || !password) {
            return res.status(500).json({
                success: false,
                message: "all filed are requird",
            })
        }
        // user is resjusterd or not
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "user is not rejustered plese Signup first",
            })
        }
        // matching password
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email:user.email,
                 id : user._id,
                 accountType:user.accountType,
            }
            // create jwt 
            const token = jwt.sign(payload, process.env.JWT_SERCET, {
                expiresIn: "2h"
            })
          
            user.token = token
    
            return res.status(200).json({
                success: true,
                token,
                user,
                messege: "Loged in successfully"
            })
        }
        else{
            return res.status(500).json({
                success: false,
                message: "password is not matching",
            })
        }

       

    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in doing login",
        })
    }
}

// chenge password

exports.chengePassword = async (req, res) => {
    try {
        //fetchin data
        const { email, password, confirmPassword, oldPassword } = req.body;
        //vallidation
       
        if (!email || !password || !confirmPassword || !oldPassword) {
            return res.status(500).json({
                success: false,
                message: "all filed are required",
            })
        }
        // matchin passwod
        if (password !== confirmPassword) {
            return res.status(500).json({
                success: false,
                message: "password is not matching",
            })
        }
      
        const user = await User.findOne({ email: email });

       
        if (await bcrypt.compare(oldPassword,user.password)) {
            const newhassedpass = await bcrypt.hash(password,10)
           await User.findByIdAndUpdate(
            {_id:user._id},
            {password:newhassedpass},
            {new:true}
           )
        }
        console.log("printingg")
        return res.status(200).json({
            success: true,
            messege: "password chenged success"
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in doing login",
        })
    }
}


exports.forgotPasswordToken  = async(req,res) => {
try{
    //fatching data
    const {email} = req.body;
    console.log(req.body)
    // valladating
    if( !email){
        return res.status(400).json({
            success:false,
            message:"all fild are required"
        })
    }

    const userData = await User.findOne({email:email});
    console.log(userData,"this is userdata hai")
    if(!userData){
        return res.status(400).json({
            success:false,
            message:"You are not vallied user"
        })
    }

    const uuid = crypto.randomUUID();
    const forgotPasswordLink = `https://shouse-dekho.vercel.app/forgot-password/${uuid}`
    console.log(forgotPasswordLink,"this si crypto ji")

    await sendMail(email,"Change Password",forgotPasswordLink);

    await User.findOneAndUpdate({email:email},{
        token:uuid
    },{new:true})

    return res.status(200).json({
        success: true,
        messege: "Change password link sent successfully"
    })

}catch(err){
    console.log(err)
    return res.status(500).json({
        success: false,
        message: "error occuring for got password token",
    }) 
}
}

exports.forgotPassword = async(req,res) =>{
    try{
    const {userId,password,conPassword} = req.body;
    console.log(req.body)
    if(!userId || !password || !conPassword){
        return res.status(400).json({
            success:false,
            message:"all fild are required"
        })
    }
    if(password !== conPassword){
        return res.status(400).json({
            success:false,
            message:"password not matched"
        }) 
    }

    const userData = await User.findOne({token:userId});
    if(!userData){
        return res.status(400).json({
            success:false,
            message:"You are not vallied user"
        })
    }
   
    const hasedPassword = await bcrypt.hash(password,10);

    await User.findOneAndUpdate({token:userId},{
        password : hasedPassword
    },{new:true})

    return res.status(200).json({
        success: true,
        messege: "Change password successfully"
    })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring for got password ",
        }) 
    }
}


