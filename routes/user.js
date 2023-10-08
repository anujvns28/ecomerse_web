const express = require("express");
const router = express.Router();

const {signup, sendOtp, chengePassword, login} = require("../controllers/auth");
const { auth, isBayer, isSeller } = require("../middleWare/auth");


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

module.exports = router