const express = require("express");
const {
  getOrdres,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderSubscriptionId,
  createOrderforRenewSubscriptio,
  DownloadOrderInvoice,
} = require("../controllers/order.controller");
const { webProtection } = require("../helper/auth");
const router = express.Router();

router.post("/getorders/:searchQuery?", webProtection, getOrdres);
router.get("/getorder/:id", webProtection, getOrderById);
router.post("/createorder", webProtection, createOrder);
router.put("/updateorder/:id", updateOrder);
router.delete("/deleteorder/:id", webProtection, deleteOrder);
router.get("/getOrderSubscriptionId/:id", getOrderSubscriptionId);

//create order for renew subscription by userid
router.post(
  "/createorderforrenewsubscriptio",
  webProtection,
  createOrderforRenewSubscriptio
);

//get order details for download order invoice pdf
router.post("/downloadorderinvoice", DownloadOrderInvoice);
module.exports = router;
