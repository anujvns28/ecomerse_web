const express = require("express");
const router = express.Router();

const {capturePayment, verifyPayment, } = require("../controllers/Payment");


router.post("/capturePayment",capturePayment);
router.post("/verifyPayment",verifyPayment);
// router.post("/sendPaymentSuccessEmail",auth,isStudent,sendPaymentSuccessEmail);

module.exports = router;
