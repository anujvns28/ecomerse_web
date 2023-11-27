const otpGenerator = require("otp-generator");
const User = require("../models/user");
const Otp = require("../models/otp")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require("../utilit/emalSender");
const profile = require("../models/profile");
const Address = require("../models/address");

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
                message: 'all fileds required'
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

        const additionalInfoId = await profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const userPayload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            accountType: accountType,
            password: hasedPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
            additionalInfo : additionalInfoId,
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