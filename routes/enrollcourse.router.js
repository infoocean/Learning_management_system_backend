const express = require("express");
const { webProtection } = require("../helper/auth");
const {
  createEnrollCourse,
  updateEnrollCourse,
  deleteEnrollCourse,
  getCourseByUser,
  getEnrollPercent,
  markAsCompleteCourse,
  checkEnrolledcourseornotbyuserId,
  getTopenrolledCourses,
  getEnrolledCourseByUser,
  updateEnrollMark,
} = require("../controllers/enrollcourse.controller");
const router = express.Router();

router.post("/createenrollcourse", webProtection, createEnrollCourse);
router.put("/updateenrollcourse/:id", webProtection, updateEnrollCourse);
router.delete("/deleteenrollcourse/:id", webProtection, deleteEnrollCourse);
router.get("/get_course_by_user_id/:id/:search?", getCourseByUser);
router.put("/markascompletecourse", markAsCompleteCourse);
router.get("/get_enrollcourse_by_user_id/:id", getEnrolledCourseByUser);
router.put("/updatemarkascompletecourse", updateEnrollMark);
router.get("/get_enroll_total/:id", getEnrollPercent);

router.post("/checenrollcourses", checkEnrolledcourseornotbyuserId);
router.get("/topenrolledcourses", getTopenrolledCourses);

module.exports = router;
