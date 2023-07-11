const express = require("express");
const { webProtection } = require("../helper/auth");
const {
  getAllSiteConfig,
  getSiteConfigById,
  createSiteConfig,
  updateSiteConfig,
  deleteSiteConfig,
  updateContnetKey,
} = require("../controllers/siteconfiguration.controller");
const router = express.Router();
const { upload } = require("../helper/upload");

router.get("/getsiteconfigs/:search?", webProtection, getAllSiteConfig);
router.get("/getsiteconfigs/:id", webProtection, getSiteConfigById);
router.post(
  "/createsiteconfig",
  webProtection,
  upload.fields([{ name: "org_logo" }, { name: "org_favicon" }]),
  createSiteConfig
);
router.put(
  "/updatesiteconfigs",
  webProtection,
  upload.fields([{ name: "org_logo" }, { name: "org_favicon" }]),
  updateSiteConfig
);
router.delete("/deletesiteconfigs/:id", webProtection, deleteSiteConfig);
router.put("/updateContentSecretKey/:id", webProtection, updateContnetKey);
module.exports = router;
