const {
  ReplaceEmailTemplate,
  GetEmailTemplates,
  GetSubscriptionDet,
} = require("../common/commonfunctions");
const sendEmails = require("../helper/sendMails");
const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Subscription = db.Subscription;
const SubscriptionPlan = db.SubscriptionPlan;
const User = db.User;

exports.createSubcsription = async (req, res) => {
  const {
    name,
    description,
    price,
    userId,
    startDate,
    status,
    duration_term,
    duration_value,
  } = req.body;

  try {
    const createSubscription = await Subscription.create({
      name: name,
      description: description,
      price: price,
      duration_term: duration_term,
      user_id: userId,
      start_date: startDate,
      status: status,
      duration_value: duration_value,
    });
    if (createSubscription) {
      //send emails
      const SubscriptoionEmailTemp = await GetEmailTemplates(
        (emailtype = "subscription_purchase")
      );
      //get subscription det after creatting subscription
      const subscriptionDet = await GetSubscriptionDet(
        createSubscription?.dataValues?.id,
        createSubscription?.dataValues?.user_id
      );
      var translations = {
        username:
          subscriptionDet?.dataValues?.user?.first_name +
          " " +
          subscriptionDet?.dataValues?.user?.last_name,
        loginurl: `${process.env.FRONTEND_URL}user/subscription/view/${createSubscription?.dataValues?.id}`,
        amount: subscriptionDet?.dataValues?.price,
      };
      const translatedHtml = await ReplaceEmailTemplate(
        translations,
        SubscriptoionEmailTemp?.dataValues?.emailbodytext
      );
      sendEmails(
        SubscriptoionEmailTemp?.dataValues?.emailfrom,
        subscriptionDet?.dataValues?.user?.email,
        SubscriptoionEmailTemp?.dataValues?.emailsubject,
        translatedHtml
      );
    }
    res.status(201).json(createSubscription);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateSubscription = async (req, res) => {
  const {
    start_date,
    status,
    startDate,
    duration_value,
    userId,
    duration_term,
    price,
    description,
    name,
    expiry_date,
  } = req.body;
  const subscription_id = req.params.id;
  const updateSubscription = await Subscription.update(
    {
      name: name,
      description: description,
      price: price,
      duration_term: duration_term,
      user_id: userId,
      duration_value: duration_value,
      start_date: start_date || startDate,
      status: status,
      expiry_date: expiry_date,
    },
    { where: { id: subscription_id } }
  );
  const updatedSubscriptionValue = await Subscription.findOne({
    where: { id: subscription_id },
  });
  res.send(updatedSubscriptionValue);
};

exports.deleteSubscription = async (req, res) => {
  const subscriptionId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deletedBy = decode.id;

  try {
    const isDeleted = await Subscription.findOne({
      where: { id: subscriptionId },
    });
    const deleteSubscription = await Subscription.update(
      { isDeleted: true, deletedBy: deletedBy },
      { where: { id: subscriptionId } }
    );
    const subscriptionDeleted = await Subscription.findOne({
      where: { id: subscriptionId },
    });
    res.status(201).json(subscriptionDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getAllSubscription = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;
  let users;

  try {
    if (search) {
      users = await Subscription.findAll({
        include: [User],
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
          isDeleted: false,
        },
      });
    } else if (req.body.status !== "all" && req.body.status) {
      users = await Subscription.findAll({
        include: [User],
        where: {
          status: req.body.status,
          isDeleted: false,
        },
      });
    } else {
      users = await Subscription.findAll({
        include: [User],
        where: { isDeleted: false },
      });
    }
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionByUserId = async (req, res) => {
  // res.send("all session");
  const subsId = req.params.id;
  try {
    const subsById = await Subscription.findAll({
      where: { user_id: subsId },
    });
    if (subsById) {
      res.status(200).json(subsById);
    }
    if (!subsById) {
      res.status(404).json("subsId not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionById = async (req, res) => {
  const subsId = req.params.id;
  try {
    const subsById = await Subscription.findOne({
      where: { id: subsId },
    });
    if (subsById) {
      res.status(200).json(subsById);
    }
    if (!subsById) {
      res.status(404).json("subsId not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionSearchByUserId = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;
  const userId = req.body.id;
  const subsId = req.params.id;
  try {
    if (search) {
      const subscription = await Subscription.findAll({
        where: {
          user_id: userId,
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      });
      res.status(200).json(subscription);
    } else {
      const subsById = await Subscription.findAll({
        where: { user_id: subsId },
      });
      if (subsById) {
        res.status(200).json(subsById);
      }
      if (!subsById) {
        res.status(404).json("subsId not Found!");
      }
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionPlans = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;
  let subscription_plans;
  try {
    if (search) {
      subscription_plans = await SubscriptionPlan.findAll({
        include: [User],
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
          is_deleted: false,
        },
      });
    } else {
      subscription_plans = await SubscriptionPlan.findAll({
        include: [User],
        where: { is_deleted: false },
      });
    }
    res.status(200).json(subscription_plans);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

exports.getSubscriptionPlansDetById = async (req, res) => {
  try {
    const subsById = await SubscriptionPlan.findOne({
      where: { id: req.params.id, is_deleted: false },
    });
    if (subsById) {
      res.status(200).json(subsById);
    }
    if (!subsById) {
      res.status(404).json("subsId not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createSubcsriptionPlan = async (req, res) => {
  const { title, amount, duration_term, duration_value } = req.body;

  const checkTitleExistOrNot = await SubscriptionPlan.findAll({
    where: { title, is_deleted: false },
  });
  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const created_by = decode.id;
  console.log(created_by, "created_by");

  try {
    if (checkTitleExistOrNot?.length > 0) {
      res.status(400).json({ message: `'${title}' title already exists` });
    } else {
      const createSubscriptionPlan = await SubscriptionPlan.create({
        title,
        amount,
        duration_term,
        duration_value,
        user_id: created_by,
      });
      res.status(201).json(createSubscriptionPlan);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateSubscriptionPlan = async (req, res) => {
  const { title, amount, duration_term, duration_value } = req.body;

  const subscriptionPlan_id = req.params.id;
  let checkTitleExistOrNot;
  if (title) {
    checkTitleExistOrNot = await SubscriptionPlan.findAll({
      where: { title, is_deleted: false },
    });
  }

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;
  console.log(checkTitleExistOrNot, "checkTitleExistOrNot");
  try {
    if (
      checkTitleExistOrNot?.length > 0 &&
      checkTitleExistOrNot[0].dataValues.id !== parseInt(subscriptionPlan_id)
    ) {
      res.status(400).json({ message: `'${title}' title already exists` });
    } else {
      await SubscriptionPlan.update(
        {
          title,
          amount,
          duration_term,
          duration_value,
          user_id: updated_by,
        },
        { where: { id: subscriptionPlan_id } }
      );
      const updatedSubscriptionPlanValue = await SubscriptionPlan.findOne({
        where: { id: subscriptionPlan_id },
      });
      res.status(201).send(updatedSubscriptionPlanValue);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.deleteSubscriptionPlan = async (req, res) => {
  const subscriptionId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deletedBy = decode.id;

  try {
    const is_Deleted = await SubscriptionPlan.findOne({
      where: { id: subscriptionId },
    });
    if (!is_Deleted) {
      res.status(400).json({ message: "Plan not found" });
    } else {
      await SubscriptionPlan.update(
        { is_deleted: true, deleted_by: deletedBy },
        { where: { id: subscriptionId } }
      );
      const subscriptionDeleted = await SubscriptionPlan.findOne({
        where: { id: subscriptionId },
      });
      res.status(201).json(subscriptionDeleted);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSubscriptionByUserIdLimitOne = async (req, res) => {
  const subsId = req.params.id;
  try {
    const subsById = await Subscription.findOne({
      where: { user_id: subsId },
      limit: 1,
      order: [["createdAt", "DESC"]],
    });
    if (subsById) {
      res.status(200).json(subsById);
    }
    if (!subsById) {
      res.status(201).json("subsId not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};
