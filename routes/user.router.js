const express = require("express");
const { upload } = require("../helper/upload");
const {
  getUsers,
  getUserById,
  updateUser,
  registration,
  loginUser,
  deleteUser,
  resetPassword,
  sendGmail,
  getUserByEmail,
  forgotPassword,
} = require("../controllers/user.controller");
const { webProtection } = require("../helper/auth");
const router = express.Router();

router.post('/getusers/:search?',webProtection, getUsers)
router.get('/getuser/:id',webProtection, getUserById)
router.post('/registration', webProtection, registration)
router.post('/loginuser', webProtection ,loginUser)
router.put('/updateuser/:id', webProtection , upload.single("profile_pic") , updateUser)
router.delete('/deleteuser/:id',webProtection, deleteUser)
router.post('/resetpassword', webProtection, resetPassword)
router.post('/sendgmail', webProtection, upload.single("attachment"), sendGmail)
router.post('/forgotpassword', webProtection, upload.single("attachment"), forgotPassword)
router.get("/getusers/:search?", webProtection, getUsers);
router.get("/getuser/:id", webProtection, getUserById);
router.post("/getuserbyemail", getUserByEmail);
router.post("/loginuser", webProtection, loginUser);
router.put(
  "/updateuser/:id",
  webProtection,
  upload.single("profile_pic"),
  updateUser
);
router.delete("/deleteuser/:id", webProtection, deleteUser);

router.post(
  "/sendgmail",
  webProtection,
  upload.single("attachment"),
  sendGmail
);

module.exports = router;
