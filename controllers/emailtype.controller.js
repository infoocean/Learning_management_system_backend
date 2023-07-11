const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Email_Type = db.EmailType;

exports.getAllEmailType = async (req, res) => {
  let emailById = req.params.id,
    emailType;
  try {
    if (emailById) {
      console.log("if");

      emailType = await Email_Type.findAll({
        where: { id: emailById },
      });
    } else {
      console.log("else");
      emailType = await Email_Type.findAll();
    }

    res.status(200).json(emailType);
  } catch (e) {
    res.status(400).json("Something went wrong");
  }
};

exports.createEmailType = async (req, res) => {
  const { emailtype } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;

  try {
    const findUser = await Email_Type.findOne({
      where: { type: emailtype },
    });

    if (!findUser) {
      email_type_create = await Email_Type.create({
        type:emailtype,
        user_id: login_user,
        created_by: login_user,
      });
      res.status(201).json(email_type_create);
    } else {
      res.status(400).json({ message: "Email type already exist" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateEmailType = async (req, res) => {
  const { emailtype } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  try {
    const checkEmailTypeId = await Email_Type.findOne({
      where: { id: req.params.id },
    });

    if (checkEmailTypeId) {
      await Email_Type.update(
        {
          type:emailtype,
          updated_by: updated_by,
        },
        { where: { id: req.params.id } }
      );
      const newUpdateEmailType = await Email_Type.findOne({
        where: { id: req.params.id },
      });
      res.status(201).json(newUpdateEmailType);
    } else {
      res.status(400).json({ message: "Id not found" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};
