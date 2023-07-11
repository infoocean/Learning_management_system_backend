const express = require("express");
const {
  getCourses,
  getCourseById,
  getCourseBySearch,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseByIdConn,
  DownloadReceiptAfterPay,
  getTotalLearner,
} = require("../controllers/course.controller");
const { webProtection } = require("../helper/auth");
const router = express.Router();
const { upload } = require("../helper/upload");

router.post("/getcourse/:search?", getCourses);
router.get("/getcourse/:id", getCourseById);
// router.get("/getcoursebysearch/:search", webProtection, getCourseBySearch)
router.post(
  "/createcourse",
  webProtection,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createCourse
);

router.put(
  "/updatecourse/:id",
  webProtection,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateCourse
);
router.delete("/deletecourse/:id", webProtection, deleteCourse);
router.get("/get_course_by_id/:id", getCourseByIdConn);
router.post("/downloadreceipt", DownloadReceiptAfterPay);
router.get("/gettotallearner/:id", getTotalLearner);

module.exports = router;
