const express = require("express");
const router = express.Router();

const {signup, sendOtp, chengePassword, login} = require("../controllers/auth");
const { auth, isBayer, isSeller } = require("../middleWare/auth");
const { getUserData, updateProfile, updateProfileImg, addAddress, deleteAddress } = require("../controllers/profile");


// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// routes for using loging
router.post("/login",login)
// routes for signup
router.post("/signup",signup)
// routes for sendig out
router.post("/sendOtp",sendOtp)
//routes for updating password
router.post("/updatePassword",auth, chengePassword)

// ********************************************************************************************************
//                                     User routes
// ********************************************************************************************************
// routes for user
router.post("/fetchUserData",getUserData)
// routes for updating profile
router.post("/updateProfile",updateProfile)
// routes for updating profile img
router.post("/updateProfileImg",updateProfileImg);
// address adding route
router.post("/addAddress",addAddress);
// delte user address
router.delete("/deleteAddres",deleteAddress)

module.exports = router