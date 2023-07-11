const db = require("../models/index.model");
require("dotenv").config();
var Sequelize = require("sequelize");
const jsonwebtoken = require("jsonwebtoken");
const Enrollcourse = db.Enrollcourse;
const User = db.User;
const Module = db.Module;
const Session = db.Session;
const Course = db.Course;
const Subscription = db.Subscription;
var Op = Sequelize.Op;
const { QueryTypes } = require("sequelize");

exports.createEnrollCourse = async (req, res) => {
  const { user_id, course_id, course_type, view_history, mark_compelete } =
    req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;

  try {
    const findLoginUser = await User.findOne({ where: { id: login_user } });

    if (!(findLoginUser.role_id == 1)) {
      //learner user
      const enrollCourse = await Enrollcourse.create({
        user_id: login_user,
        course_id: course_id,
        course_type: course_type,
        created_by: login_user,
        view_history: view_history,
        mark_compelete: mark_compelete,
      });
      res.status(201).json(enrollCourse);
    }

    if (findLoginUser.role_id == 1) {
      // admin user
      const enrollCourse = await Enrollcourse.create({
        user_id: user_id,
        course_id: course_id,
        course_type: course_type,
        created_by: login_user,
        view_history: view_history,
        mark_compelete: mark_compelete,
      });
      res.status(201).json(enrollCourse);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateEnrollCourse = async (req, res) => {
  const enrollCourseId = req.params.id;

  const {
    user_id,
    course_id,
    course_type,
    view_history,
    mark_compelete: mark_compelete,
  } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  const enrollCourseUpdate = await Enrollcourse.update(
    {
      user_id: user_id,
      course_id: course_id,
      course_type: course_type,
      view_history: view_history,
      updated_by: updated_by,
      mark_compelete: mark_compelete,
    },
    { where: { id: enrollCourseId } }
  );

  const newUpdatedEnrollCourse = await Enrollcourse.findOne({
    where: { id: enrollCourseId },
  });
  res.status(201).json(newUpdatedEnrollCourse);
};

exports.deleteEnrollCourse = async (req, res) => {
  const enrollCourseId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;

  try {
    const enrollCourseDelete = await Enrollcourse.update(
      {
        is_deleted: true,
        deleted_by: deleted_by,
      },
      { where: { id: enrollCourseId } }
    );

    const enrollCourseDeleted = await Enrollcourse.findOne({
      where: { id: enrollCourseId },
    });
    res.status(201).json(enrollCourseDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getCourseByUser = async (req, res) => {
  const user_id = req.params.id;
  const search = req.params.search;
  try {
    if (search) {
      const getEnrollData = await Enrollcourse.findAll({
        where: { user_id: user_id, is_deleted: false },
        include: [
          {
            model: Course,
            where: {
              title: {
                [Op.like]: `%${search}%`,
              },
              status: "active",
              is_deleted: false,
            },
          },
        ],
      });
      const moduleCounts = await Module.findAll({
        where: { is_deleted: false },
        attributes: [
          "course_id",
          [Sequelize.fn("COUNT", Sequelize.col("course_id")), "moduleCount"],
        ],
        group: ["course_id"],
      });
      const moduleCountsMap = new Map();
      moduleCounts.forEach((count) => {
        moduleCountsMap.set(count.course_id, count.moduleCount);
      });

      const sessionCounts = await Session.findAll({
        where: { is_deleted: false },
        attributes: [
          "course_id",
          [Sequelize.fn("COUNT", Sequelize.col("course_id")), "sessionCount"],
        ],
        group: ["course_id"],
      });
      const sessionCountsMap = new Map();
      sessionCounts.forEach((count) => {
        sessionCountsMap.set(count.course_id, count.sessionCount);
      });
      //////////////////Percent of completed//////////////////////////////
      const enrollCourse = await Enrollcourse.findAll({
        where: { user_id: user_id },
      });

      let getEnrollData1;
      const courseIdCounts = {};
      for (let i = 0; i < enrollCourse.length; i++) {
        getEnrollData1 = enrollCourse[i].view_history;
        if (getEnrollData1 !== null) {
          getEnrollData1.map((ea) => {
            Object.assign(ea, { courseId: enrollCourse[i].course_id });
          });

          getEnrollData1.forEach((obj) => {
            const courseId = obj["courseId"];

            if (!courseIdCounts[courseId]) {
              courseIdCounts[courseId] = 0;
            }

            for (const key in obj) {
              if (key !== "courseId") {
                courseIdCounts[courseId] += obj[key].length;
              }
            }
          });
        } else {
          console.log("empty");
        }
      }

      ///////////////////////Percent of completed//////////////////////////
      const combinedArray = getEnrollData.map((course) => {
        const sessionCount = sessionCounts.filter((count) =>
          count.course_id !== course.course_id
            ? count.sessionCount
            : { sessionCount: 0 }
        );
        const moduleCount = moduleCounts.filter((count) =>
          count.course_id !== course.course_id
            ? count.moduleCount
            : { moduleCount: 0 }
        );
        return {
          course,
          courseIdCounts: courseIdCounts,
          sessionCount: sessionCount,
          moduleCount: moduleCount,
        };
      });

      if (combinedArray) {
        res.status(200).json(combinedArray);
      }
      if (!combinedArray) {
        res.status(404).json("User Id not Found!");
      }
    } else {
      const getEnrollData = await Enrollcourse.findAll({
        where: { user_id: user_id, is_deleted: false },
        include: [
          {
            model: Course,
            where: {
              status: "active",
            },
          },
        ],
      });
      const moduleCounts = await Module.findAll({
        where: { is_deleted: false },
        attributes: [
          "course_id",
          [Sequelize.fn("COUNT", Sequelize.col("course_id")), "moduleCount"],
        ],
        group: ["course_id"],
      });
      const moduleCountsMap = new Map();
      moduleCounts.forEach((count) => {
        moduleCountsMap.set(count.course_id, count.moduleCount);
      });

      const sessionCounts = await Session.findAll({
        where: { is_deleted: false },
        attributes: [
          "course_id",
          [Sequelize.fn("COUNT", Sequelize.col("course_id")), "sessionCount"],
        ],
        group: ["course_id"],
      });
      const sessionCountsMap = new Map();
      sessionCounts.forEach((count) => {
        sessionCountsMap.set(count.course_id, count.sessionCount);
      });
      ////////////////////////////////////////////////
      const enrollCourse = await Enrollcourse.findAll({
        where: { user_id: user_id },
      });

      let getEnrollData1;
      const courseIdCounts = {};
      for (let i = 0; i < enrollCourse.length; i++) {
        getEnrollData1 = enrollCourse[i].view_history;
        if (getEnrollData1 !== null) {
          getEnrollData1.map((ea) => {
            Object.assign(ea, { courseId: enrollCourse[i].course_id });
          });

          getEnrollData1.forEach((obj) => {
            const courseId = obj["courseId"];
            if (!courseIdCounts[courseId]) {
              courseIdCounts[courseId] = 0;
            }
            for (const key in obj) {
              if (key !== "courseId") {
                courseIdCounts[courseId] += obj[key].length;
              }
            }
          });
        } else {
          console.log("empty");
        }
      }

      /////////////////////////////////////////////////
      const combinedArray = getEnrollData.map((course) => {
        const sessionCount = sessionCounts.filter((count) =>
          count.course_id !== course.course_id
            ? count.sessionCount
            : { sessionCount: 0 }
        );
        console.log("sessionCountsessionCount", sessionCount);
        const moduleCount = moduleCounts.filter((count) =>
          count.course_id !== course.course_id
            ? count.moduleCount
            : { moduleCount: 0 }
        );
        return {
          course,
          courseIdCounts: courseIdCounts,
          sessionCount: sessionCount,
          moduleCount: moduleCount,
        };
      });
      if (combinedArray) {
        res.status(200).json(combinedArray);
      }
      if (!combinedArray) {
        res.status(404).json("User Id not Found!");
      }
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getEnrollPercent = async (req, res) => {
  const user_id = req.params.id;

  try {
    const enrollCourse = await Enrollcourse.findAll({
      where: { user_id: user_id },
    });

    let getEnrollData;
    let arr = [];
    const courseIdCounts = {};
    for (let i = 0; i < enrollCourse.length; i++) {
      getEnrollData = enrollCourse[i].view_history;
      getEnrollData.map((ea) => {
        Object.assign(ea, { courseId: enrollCourse[i].course_id });
      });

      getEnrollData.forEach((obj) => {
        const courseId = obj["courseId"];

        if (!courseIdCounts[courseId]) {
          courseIdCounts[courseId] = 0;
        }

        for (const key in obj) {
          if (key !== "courseId") {
            courseIdCounts[courseId] += obj[key].length;
          }
        }
      });
      // getEnrollData.forEach((item) => {
      //   arr.push(item);
      // });
    }
    const response = {
      courseIdCounts: courseIdCounts,
    };

    res.status(201).json(response);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.checkEnrolledcourseornotbyuserId = async (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    const checkenrolledcourse = await Enrollcourse.findAll({
      where: {
        user_id: user_id,
        course_id: course_id,
      },
    });
    res.status(200).json(checkenrolledcourse);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.markAsCompleteCourse = async (req, res) => {
  const { user_id, course_id, module_id, session_id } = req.body;
  try {
    if (!user_id && !course_id) {
      res.status(404).json("All field are required!");
    } else {
      const updateEnroll = await Enrollcourse.findOne({
        where: { user_id: user_id, course_id: course_id },
      });
      if (updateEnroll) {
        const enrollId = updateEnroll.view_history;
        if (enrollId === null) {
          let data = [
            {
              [module_id]: [session_id],
            },
          ];
          const updateEnl = await Enrollcourse.update(
            { view_history: data },
            { where: { id: updateEnroll.id } }
          );
          res.status(201).json("Mark as complete successfully");
        } else {
          const alreadyExists = await Enrollcourse.findOne({
            where: { id: updateEnroll.id },
          });
          const viewHistory = alreadyExists?.view_history;
          for (let i = 0; i < viewHistory.length; i++) {
            const key = module_id;
            const value = session_id;
            // Check if the key exists in the viewHistory array
            const objectIndex = viewHistory.findIndex((obj) =>
              obj.hasOwnProperty(key)
            );
            if (objectIndex !== -1) {
              const existingArray = viewHistory[objectIndex][key];

              if (existingArray.includes(value)) {
                res.status(201).json("Already Completed");
              } else {
                // Value is not present, push it to the associated array
                existingArray.push(value);
                viewHistory[objectIndex][key] = existingArray;

                const updateEnl = await Enrollcourse.update(
                  { view_history: viewHistory },
                  { where: { id: updateEnroll.id } }
                );

                res.status(201).json("Mark as complete successfully");
              }
            } else {
              const index = 0; // Index where the key-value pair should be inserted

              if (index >= 0 && index < viewHistory.length) {
                const obj = viewHistory[index];
                obj[key] = [value];
                const updateEnl = await Enrollcourse.update(
                  { view_history: viewHistory },
                  { where: { id: updateEnroll.id } }
                );
                res.status(201).json("Mark as complete successfully");
              } else {
                console.error("Invalid index");
              }
            }
          }
        }
      } else {
        console.log("Enrollment not found");
      }
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getTopenrolledCourses = async (req, res) => {
  try {
    db.sequelize
      .query(
        "SELECT S.id, S.title,S.image, S.is_chargeable, count(S.id) as count FROM courses S INNER JOIN `enroll-courses` R ON S.id = R.course_id WHERE S.status = 'active' GROUP BY S.id, S.title ORDER BY LENGTH(count), count desc",
        {
          type: db.sequelize.QueryTypes.SELECT,
        }
      )
      .then((courses) => {
        res.status(200).json(courses);
      });
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateEnrollMark = async (req, res) => {
  const { user_id, course_id, module_id, session_id, status } = req.body;
  try {
    if (!user_id && !course_id) {
      res.status(404).json("All field are required!");
    } else {
      const updateEnroll = await Enrollcourse.findOne({
        where: { user_id: user_id, course_id: course_id, course_type: status },
      });
      if (updateEnroll) {
        const updateEnl = await Enrollcourse.update(
          { mark_compelete: 1 },
          { where: { id: updateEnroll.id } }
        );
        res.status(201).json("Course view 100%");
      } else {
        console.log("something went wrong");
      }
    }
  } catch (e) {
    res.status(201).json("Already View");
  }
};

exports.getEnrolledCourseByUser = async (req, res) => {
  const user_id = req.params.id;
  try {
    const getEnrollData = await Enrollcourse.findAll({
      where: { user_id: user_id, is_deleted: false, mark_compelete: 0 },
      limit: 8,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Course,
          where: {
            status: "active",
          },
        },
      ],
    });

    const subsById = await Subscription.findOne({
      where: { user_id: user_id },
      limit: 1,
      order: [["createdAt", "DESC"]],
    });

    const moduleCounts = await Module.findAll({
      where: { is_deleted: false },
      attributes: [
        "course_id",
        [Sequelize.fn("COUNT", Sequelize.col("course_id")), "moduleCount"],
      ],
      group: ["course_id"],
    });
    const moduleCountsMap = new Map();
    moduleCounts.forEach((count) => {
      moduleCountsMap.set(count.course_id, count.moduleCount);
    });

    const sessionCounts = await Session.findAll({
      where: { is_deleted: false },
      attributes: [
        "course_id",
        [Sequelize.fn("COUNT", Sequelize.col("course_id")), "sessionCount"],
      ],
      group: ["course_id"],
    });
    const sessionCountsMap = new Map();
    sessionCounts.forEach((count) => {
      sessionCountsMap.set(count.course_id, count.sessionCount);
    });
    ////////////////////////////////////////////////
    const enrollCourse = await Enrollcourse.findAll({
      where: { user_id: user_id },
    });

    let getEnrollData1;
    const courseIdCounts = {};
    for (let i = 0; i < enrollCourse.length; i++) {
      getEnrollData1 = enrollCourse[i].view_history;
      if (getEnrollData1 !== null) {
        getEnrollData1.map((ea) => {
          Object.assign(ea, { courseId: enrollCourse[i].course_id });
        });

        getEnrollData1.forEach((obj) => {
          const courseId = obj["courseId"];
          if (!courseIdCounts[courseId]) {
            courseIdCounts[courseId] = 0;
          }
          for (const key in obj) {
            if (key !== "courseId") {
              courseIdCounts[courseId] += obj[key].length;
            }
          }
        });
      } else {
        console.log("empty");
      }
    }

    /////////////////////////////////////////////////
    const combinedArray = getEnrollData.map((course) => {
      const sessionCount = sessionCounts.filter((count) =>
        count.course_id !== course.course_id
          ? count.sessionCount
          : { sessionCount: 0 }
      );
      const moduleCount = moduleCounts.filter((count) =>
        count.course_id !== course.course_id
          ? count.moduleCount
          : { moduleCount: 0 }
      );
      return {
        course,
        courseIdCounts: courseIdCounts,
        sessionCount: sessionCount,
        moduleCount: moduleCount,
      };
    });
    if (combinedArray || subsById) {
      res
        .status(200)
        .json({ subscription: subsById, enroll_course: combinedArray });
    }
    if (!combinedArray) {
      res.status(404).json("User Id not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};
