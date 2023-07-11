const {
  generateToken,
  hashPassword,
  isValidPassword,
} = require("../helper/auth");

require("dotenv").config();

const jsonwebtoken = require("jsonwebtoken");
const db = require("../models/index.model");
const { capitalizeFirstLetter } = require("../helper/help");
const { generateHashPass } = require("../helper/generatePassword");
const sendEmails = require("../helper/sendMails");

const User = db.User;
const EmailManage = db.EmailManage;
const Site = db.Site;
const fs = require('fs');


exports.getUsers = async (req, res) => {
  const sequelize = require("sequelize");
  const search = req.params.search;
  const { role_id, status } = req.body;

  try {
    if (search) {
      const users = await User.findAll({
        where: {
          [sequelize.Op.or]: {
            namesQuery: sequelize.where(
              sequelize.fn(
                "concat",
                sequelize.col("first_name"),
                " ",
                sequelize.col("last_name")
              ),
              {
                [sequelize.Op.like]: `%${search}%`,
              }
            ),
          },
          is_deleted: false,
        },
      });
      res.status(200).json(users);
    } else if (role_id == 0 && status) {
      const users = await User.findAll({
        where: {
          is_deleted: false,
          status,
        },
      });
      res.status(200).json(users);
    } else if (role_id && status == 0) {
      const users = await User.findAll({
        where: {
          is_deleted: false,
          role_id,
        },
      });
      res.status(200).json(users);
    } else if (role_id && status) {
      const users = await User.findAll({
        where: {
          is_deleted: false,
          role_id,
          status,
        },
      });
      res.status(200).json(users);
    } else {
      const users = await User.findAll({ where: { is_deleted: false } });
      res.status(200).json(users);
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const getUserById = await User.findOne({
      where: { id: userId, is_deleted: false },
    });

    if (getUserById) {
      res.status(200).json(getUserById);
    }
    if (!getUserById) {
      res.status(404).json("User not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const getUserByemail = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    if (getUserByemail) {
      res.status(200).json(getUserByemail);
    }
    if (!getUserByemail) {
      res.status(404).json("User not Found!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.registration = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    role_id,
    profile_pic,
    loggedin_by,
    identifier,
  } = req.body;

  const checkToken = req.headers.logintoken;
  if (email && identifier === "admin_logged_in") {
    const checkToken = req.headers.logintoken;

    const findUser = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    if (findUser) {
      res.status(400).json("Email already Registered!");
    }

    if (!findUser) {
      const genPass = JSON.parse(await generateHashPass());
      const user = await User.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: genPass.encPass,
        role_id: role_id,
        // created_by: login_user,
      });

      const findEmailSendingData = await EmailManage.findOne({
        where: { emailtype: 'user_registration' },
      });

      const findOrgLogo = await Site.findOne({
        where: { key: 'org_logo' },
      });

      let contentData = findEmailSendingData.dataValues.emailbodytext
        .replace("{{username}}", `${capitalizeFirstLetter(user?.first_name)} ${user?.last_name}`)
        .replace("{{email}}", email)
        .replace("{{password}}", genPass.pass)
        .replace("{{org_logo}}", findOrgLogo.dataValues.value);    

      const send = require("gmail-send")({
        user: findEmailSendingData.emailfrom,
        pass: process.env.EMAIL_PASS,
        to: email,
        subject: findEmailSendingData.emailsubject,
      });
      // const filepath = req.file.path;
      try {
        const { result, full } = await send({
          html: `${contentData}`,
          // files: [filepath]
        });
      } catch (error) {
        res.json(error);
      }
      res.status(201).json(user);
    }
    // }
  }
  else {
    const findUser = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    if ((email && loggedin_by === "facebook") || (email && loggedin_by === "google")) {
      //  return res.send('fb or google')

      if (findUser !== null) {
        // return res.status(400).json("Email already Registered!")
        const user = await User.update(
          {
            first_name: first_name,
            last_name: last_name,
            email: email,
            profile_pic: profile_pic,
            loggedin_by: loggedin_by,
          },
          { where: { id: findUser.dataValues.id } }
        );
        const updatedUser = await User.findOne({
          where: { id: findUser.dataValues.id },
        });
        const token = await generateToken({
          id: findUser.dataValues.id,
          email: email,
        });
        return res.status(201).json({ updatedUser, loginToken: token });
      } else {
        const user = await User.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          profile_pic: profile_pic,
          loggedin_by: loggedin_by,
        });
        const token = await generateToken({
          id: user.dataValues.id,
          email: email,
        });

        return res.status(201).json({ user, loginToken: token });
      }
    } else {
      if (findUser) {
        // learner self registration
        return res.status(400).json("Email already Registered!");
      } else if (!email) {
        return res.status(400).json("Email feild is Required!");
      } else {
        const user = await User.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: await hashPassword(
            password ? password : process.env.TEMPPASS
          ),
          role_id: role_id,
        });

        const findEmailSendingData = await EmailManage.findOne({
          where: { emailtype: 'user_registration' },
        });

        const findOrgLogo = await Site.findOne({
          where: { key: 'org_logo' },
        });
        let contentData = findEmailSendingData.dataValues.emailbodytext
          .replace("{{username}}", `${capitalizeFirstLetter(user?.first_name)} ${user?.last_name}`)
          // .replace("{{email}}", email)
          // .replace("{{password}}", password)
          .replace("Your login credentials are Email: {{email}} and  Password : {{password}}", '')
          .replace("{{org_logo}}", findOrgLogo.dataValues.value);
    

          console.log('data', contentData)
          // return false;
        sendEmails(findEmailSendingData.emailfrom, email, findEmailSendingData.emailsubject, contentData)
        return res.status(201).json(user);
      }
    }
  }


};

exports.loginUser = async (req, res) => {
  const { email, password, identifier } = req.body;

  console.log(req.body)

  if (email && identifier === "userautologinwithemail") {
    const user = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    const token = await generateToken({
      id: user.id,
      email: user.email,
    });
    res.status(200).json({
      userDetails: user,
      loginToken: token,
    });
  } else {
    const user = await User.findOne({
      where: { email: email, is_deleted: false },
    });
    if (!user) {
      return res.status(404).json("User not exist with this Email!");
    }
    const validPassword = await isValidPassword(password, user.password);
    if (!validPassword) {
      res.status(400).json("Password Incorrect!");
    }
    if (validPassword) {
      const token = await generateToken({
        id: user.id,
        email: user.email,
      });

      res.status(200).json({
        userDetails: user,
        loginToken: token,
      });
    }
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  let profile_pic;
  if (req.file) {
    profile_pic = req.file.path;
  }
  const findUser = await User.findOne({
    where: { id: userId, is_deleted: false },
  });
  if (!findUser) {
    res.status(404).json("User not Found!");
  }

  if (findUser) {
    const { first_name, last_name, email, role_id, status } = req.body;

    const token = req.headers.logintoken;
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
    const updated_by = decode.id;
    const checkEmail = await User.findOne({ where: { email: email } });
    const existUser = await User.findOne({
      where: { email: email, id: userId },
    });
    if (!checkEmail || existUser) {
      const update = await User.update(
        {
          first_name: first_name,
          last_name: last_name,
          role_id: role_id,
          status,
          email: email,
          updated_by: updated_by,
          profile_pic: profile_pic,
        },
        { where: { id: userId } }
      );
      const updatedUser = await User.findOne({ where: { id: userId } });
      return res.status(201).json(updatedUser);
    }

    if (checkEmail) {
      return res.status(400).json("Email already Registered!");
    }
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;
  try {
    const userDelete = await User.update(
      {
        is_deleted: true,
        deleted_by: deleted_by,
      },
      { where: { id: userId } }
    );

    const deletedUser = await User.findOne({ where: { id: userId } });
    res.status(201).json(deletedUser);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
    const user_id = decode.id;
    
    const findUser = await User.findOne({
      where: { id: user_id, is_deleted: false },
    });

    if (!findUser) {
      console.log("user not Found!");
      return res.status(400).json("user not Found!");
    }

    if (findUser) {
      findUser.password = await hashPassword(password);
      findUser.save();

      res.status(202).json("password change succesfully!");
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.forgotPassword = async (req, res) => {
  const { to, emailType } = req.body;
  const findUser = await User.findOne({
    where: { email: to, is_deleted: false },
  });

  if (!findUser) {
    return res.status(400).json("Email not found!");
  }

  const findEmailSendingData = await EmailManage.findOne({
    where: { emailtype: emailType },
  });

  if (findUser) {
    const send = require("gmail-send")({
      user: findEmailSendingData.emailfrom,
      pass: process.env.EMAIL_PASS,
      to,
      subject: findEmailSendingData.emailsubject,
    });
    try {
      const genToken = await generateToken({
        id: findUser.id,
        email: findUser.email,
      });

      const findOrgLogo = await Site.findOne({
        where: { key: 'org_logo' },
      });

      let result = findEmailSendingData.dataValues.emailbodytext
          .replace("{{username}}", `${capitalizeFirstLetter(findUser?.first_name)} ${findUser?.last_name}`)
          .replace("{{forgotPasswordToken}}", genToken)
          .replace("{{org_logo}}", findOrgLogo.dataValues.value);
          

          console.log('result: ', result);
      const { full } = await send({
        html: `${result}`,
        // files: [filepath],
      });   
      res.status(200).json(result);
    } catch (error) {
      res.json(error);
    }
  }
}

exports.sendGmail = async (req, res) => {
  const { to, emailType } = req.body;

  const findUser = await User.findOne({
    where: { email: to, is_deleted: false },
  });

  if (!findUser) {
    return res.status(400).json("this email is not register with us!");
  }

  const findEmailSendingData = await EmailManage.findOne({
    where: { emailtype: emailType },
  });

  let result = findEmailSendingData.dataValues.emailbodytext.replace(
    "{{username}}",
    `${capitalizeFirstLetter(findUser && findUser?.first_name)} ${findUser && findUser?.last_name
    }`
  );



  if (findUser) {
    const send = require("gmail-send")({
      user: findEmailSendingData.emailfrom,
      pass: process.env.EMAIL_PASS,
      to,
      subject: findEmailSendingData.emailsubject,
    });

    // const filepath = req.file.path;

    try {
      const { full } = await send({
        html: `${result}`,
        // files: [filepath],
      });
      const genToken = await generateToken({
        id: findUser.id,
        email: findUser.email,
      });
      res.status(200).json(genToken);
    } catch (error) {
      res.json(error);
    }
  }
};
