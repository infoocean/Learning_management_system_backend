const express = require("express");
const {
  //createStripeCustomer,
  AcceptPayment,
  GetpaymentDetailsBycheckoutSessionIdPayment,
  //   getStripeCustomer,
  //   updateStripeCustomer,
  //   deleteStripeCustomer,
  //   cardToken,
} = require("../controllers/payment.controller");
const { webProtection } = require("../helper/auth");
const router = express.Router();

router.post("/acceptpayment", AcceptPayment);
router.post("/getpaymentdetails", GetpaymentDetailsBycheckoutSessionIdPayment);

// router.get("/payment/:id", webProtection, getStripeCustomer);
// router.put("/payment/:id", webProtection, updateStripeCustomer);
// router.delete("/payment/:id", webProtection, deleteStripeCustomer);
// router.post("/cardtoken", webProtection, cardToken);

module.exports = router;
