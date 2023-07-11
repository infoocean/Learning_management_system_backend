const db = require("../models/index.model");
require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const Site = db.Site;

exports.getAllSiteConfig = async (req, res) => {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const search = req.params.search;

  try {
    let allSiteConfig;
    if (search) {
      allSiteConfig = await Site.findAll({});
    } else {
      allSiteConfig = await Site.findAll({});
    }
    res.status(200).json(allSiteConfig);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getSiteConfigById = async (req, res) => {
  const userId = req.params.id;
  try {
    const siteById = await Site.findAll({
      where: { user_id: userId },
    });

    res.status(200).json(siteById);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.createSiteConfig = async (req, res) => {
  let org_logo, org_favicon, site_Create, obj;
  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const login_user = decode.id;
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;

  if (req.files !== null) {
    org_logo = req?.files?.org_logo && req?.files?.org_logo[0].path;
    org_favicon = req?.files?.org_favicon && req?.files?.org_favicon[0].path;
  }

  if (
    req.body.title ||
    req?.files?.org_logo ||
    req?.files?.org_favicon ||
    req.body.content_sk
  ) {
    obj = {
      title: req.body.title,
      org_logo: org_logo,
      org_favicon: org_favicon,
      content_sk: req.body.content_sk,
    };
  } else {
    obj = {
      org_pk: req.body.org_pk,
      org_sk: req.body.org_sk,
    };
  }

  const arrayOfObjects = Object.entries(obj).map(([key, value]) => ({
    key,
    value,
  }));

  try {
    const findUser = await Site.findAll({
      where: {
        key: {
          [Op.or]: [
            "title",
            "org_logo",
            "org_favicon",
            "org_pk",
            "org_sk",
            "content_sk",
          ],
        },
        user_id: login_user,
      },
    });
    if (findUser.length === 0 || findUser.length < 6) {
      for (let index = 0; index < arrayOfObjects.length; index++) {
        site_Create = await Site.create({
          user_id: login_user,
          key: arrayOfObjects[index].key,
          value: arrayOfObjects[index].value,
          created_by: login_user,
        });
      }
      res.status(201).json(site_Create);
    } else {
      res
        .status(400)
        .json({ message: "User already inserted site configurations" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateSiteConfig = async (req, res) => {
  let org_logo, org_favicon, obj;

  if (req.files !== null) {
    org_logo = req?.files?.org_logo && req?.files?.org_logo[0].path;
    org_favicon = req?.files?.org_favicon && req?.files?.org_favicon[0].path;
  }

  if (
    req.body.title ||
    req?.files?.org_logo ||
    req?.files?.org_favicon ||
    req.body.content_sk
  ) {
    obj = {
      title: req.body.title,
      org_logo: org_logo,
      org_favicon: org_favicon,
      content_sk: req.body.content_sk,
    };
  } else {
    obj = {
      org_pk: req.body.org_pk,
      org_sk: req.body.org_sk,
    };
  }

  const arrayOfObjects = Object.entries(obj).map(([key, value]) => ({
    key,
    value,
  }));

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  try {
    for (let index = 0; index < arrayOfObjects.length; index++) {
      const siteOption = await Site.findOne({
        where: { key: arrayOfObjects[index].key },
        attributes: ["id"],
      });
      if (siteOption) {
        const siteId = siteOption.id;

        await Site.update(
          {
            key: arrayOfObjects[index].key,
            value: arrayOfObjects[index].value,
            user_id: updated_by,
            updated_by: updated_by,
          },
          { where: { id: siteId } }
        );
      } else {
        console.log(`Site-option with key ${key} not found.`);
      }
    }
    const newUpdateSiteConfig = await Site.findAll({
      where: { user_id: updated_by },
    });
    res.status(201).json(newUpdateSiteConfig);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.deleteSiteConfig = async (req, res) => {
  const siteId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;

  try {
    const siteConfigDelete = await Site.update(
      {
        deleted_by: deleted_by,
      },
      { where: { id: siteId } }
    );

    const siteConfigDeleted = await Site.findOne({ where: { id: siteId } });
    res.status(200).json(siteConfigDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateContnetKey = async (req, res) => {
  let Id = req.params.id;
  const { is_deleted } = req.body;

  try {
    await Site.update(
      {
        is_deleted: is_deleted,
      },
      { where: { id: Id } }
    );
    res.status(201).json("Update successfully");
  } catch (e) {
    res.status(400).send(e);
  }
};
