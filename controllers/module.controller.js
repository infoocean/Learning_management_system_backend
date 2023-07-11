const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");

const Module = db.Module;
const Session = db.Session;

exports.getModules = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;
  const { course_id, status } = req.body;
  try {
    if (search) {
      const modules = await Module.findAll({
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
          is_deleted: false,
        },
        include: [
          {
            model: db.Course,
          },
        ],
      });
      const moduleCounts = await Session.findAll({
        attributes: [
          "module_id",
          [Sequelize.fn("COUNT", Sequelize.col("module_id")), "sessionCount"],
        ],
        group: ["module_id"],
        where: { is_deleted: false }
      });
      const moduleCountsMap = new Map();
      moduleCounts.forEach((count) => {
        moduleCountsMap.set(count.module_id, count.sessionCount);
      });
      const combinedArray = modules.map((module) => {
        const sessionCount = moduleCounts.find(
          (count) => count.module_id === module.id
        ) || { sessionCount: 0 };
        return {
          module,
          sessionCount: sessionCount,
        };
      });
      res.status(200).json(combinedArray);
    } else if (course_id && status) {
      const modules = await Module.findAll({
        where: {
          is_deleted: false,
          course_id,
          status,
        },
        include: [
          {
            model: db.Course,
          },
        ],
      });
      const moduleCounts = await Session.findAll({
        attributes: [
          "module_id",
          [Sequelize.fn("COUNT", Sequelize.col("module_id")), "sessionCount"],
        ],
        group: ["module_id"],
        where: { is_deleted: false }
      });
      const moduleCountsMap = new Map();
      moduleCounts.forEach((count) => {
        moduleCountsMap.set(count.module_id, count.sessionCount);
      });
      const combinedArray = modules.map((module) => {
        const sessionCount = moduleCounts.find(
          (count) => count.module_id === module.id
        ) || { sessionCount: 0 };
        return {
          module,
          sessionCount: sessionCount,
        };
      });
      res.status(200).json(combinedArray);
    } else if (course_id && status === 0) {
      const modules = await Module.findAll({
        where: {
          is_deleted: false,
          course_id,
        },
        include: [
          {
            model: db.Course,
          },
        ],
      });
      const moduleCounts = await Session.findAll({
        attributes: [
          "module_id",
          [Sequelize.fn("COUNT", Sequelize.col("module_id")), "sessionCount"],
        ],
        group: ["module_id"],
        where: { is_deleted: false }
      });
      const moduleCountsMap = new Map();
      moduleCounts.forEach((count) => {
        moduleCountsMap.set(count.module_id, count.sessionCount);
      });
      const combinedArray = modules.map((module) => {
        const sessionCount = moduleCounts.find(
          (count) => count.module_id === module.id
        ) || { sessionCount: 0 };
        return {
          module,
          sessionCount: sessionCount,
        };
      });
      res.status(200).json(combinedArray);
    } else if (course_id === 0 && status) {
      const modules = await Module.findAll({
        where: {
          is_deleted: false,
          status,
        },
        include: [
          {
            model: db.Course,
          },
        ],
      });
      const moduleCounts = await Session.findAll({
        attributes: [
          "module_id",
          [Sequelize.fn("COUNT", Sequelize.col("module_id")), "sessionCount"],
        ],
        group: ["module_id"],
        where: { is_deleted: false }
      });
      const moduleCountsMap = new Map();
      moduleCounts.forEach((count) => {
        moduleCountsMap.set(count.module_id, count.sessionCount);
      });
      const combinedArray = modules.map((module) => {
        const sessionCount = moduleCounts.find(
          (count) => count.module_id === module.id
        ) || { sessionCount: 0 };
        return {
          module,
          sessionCount: sessionCount,
        };
      });
      res.status(200).json(combinedArray);
    } else if (course_id === 0 && status === 0) {
      const modules = await Module.findAll({
        where: {
          is_deleted: false,
        },
        include: [
          {
            model: db.Course,
          },
        ],
      });
      const moduleCounts = await Session.findAll({
        attributes: [
          "module_id",
          [Sequelize.fn("COUNT", Sequelize.col("module_id")), "sessionCount"],
        ],
        group: ["module_id"],
        where: { is_deleted: false }
      });
      const moduleCountsMap = new Map();
      moduleCounts.forEach((count) => {
        moduleCountsMap.set(count.module_id, count.sessionCount);
      });
      const combinedArray = modules.map((module) => {
        const sessionCount = moduleCounts.find(
          (count) => count.module_id === module.id
        ) || { sessionCount: 0 };
        return {
          module,
          sessionCount: sessionCount,
        };
      });
      res.status(200).json(combinedArray);
    } else {
      const modules = await Module.findAll({
        where: {
          is_deleted: false,
        },
        include: [
          {
            model: db.Course,
          },
        ],
      });
      const moduleCounts = await Session.findAll({
        attributes: [
          "module_id",
          [Sequelize.fn("COUNT", Sequelize.col("module_id")), "sessionCount"],
        ],
        group: ["module_id"],
        where: { is_deleted: false }
      });
      const moduleCountsMap = new Map();
      moduleCounts.forEach((count) => {
        moduleCountsMap.set(count.module_id, count.sessionCount);
      });
      const combinedArray = modules.map((module) => {
        const sessionCount = moduleCounts.find(
          (count) => count.module_id === module.id
        ) || { sessionCount: 0 };
        return {
          module,
          sessionCount: sessionCount,
        };
      });
      res.status(200).json(combinedArray);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getModuleById = async (req, res) => {
  // res.send("module By id");
  const moduleId = req.params.id;
  try {
    const moduleById = await Module.findOne({
      where: { id: moduleId, is_deleted: false },
    });

    if (moduleById) {
      res.status(200).json(moduleById);
    }
    if (!moduleById) {
      res.status(404).json("Module not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createModule = async (req, res) => {
  const { title, description, course_id, status } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const user_id = decode.id;

  try {
    moduleCreated = await Module.create({
      title: title,
      description: description,
      course_id: course_id,
      user_id: user_id,
      created_by: user_id,
      status,
    });
    res.status(201).json(moduleCreated);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.updateModule = async (req, res) => {
  const { title, description, course_id, status } = req.body;

  const moduleId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const user_id = decode.id;

  try {
    moduleUpdate = await Module.update(
      {
        title: title,
        description: description,
        course_id: course_id,
        user_id: user_id,
        updated_by: user_id,
        status,
      },
      { where: { id: moduleId } }
    );

    const updatedModule = await Module.findOne({ where: { id: moduleId } });
    res.status(201).json(updatedModule);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.deleteModule = async (req, res) => {
  const moduleId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;

  try {
    findModule = await Module.findOne({ where: { id: moduleId } });
    if (findModule) {
      const isDeleted = await Module.update(
        { is_deleted: true, deleted_by: deleted_by },
        { where: { id: moduleId } }
      );
      const moduleDeleted = await Module.findOne({ where: { id: moduleId } });
      const findSesssionDeleted = await Session.update(
        { is_deleted: true, deleted_by: deleted_by },
        {
          where: { module_id: moduleId },
        }
      );
      res.status(201).send(moduleDeleted);
    }

    if (!findModule) {
      res.status(404).json("No module awailable!");
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
