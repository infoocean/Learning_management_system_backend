const Sequelize = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DATABASE,
  "root",
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model")(sequelize, Sequelize);
db.Course = require("./course.model")(sequelize, Sequelize);
db.Module = require("./module.model")(sequelize, Sequelize);
db.Session = require("./session.model")(sequelize, Sequelize);
db.Subscription = require("./subscription.model")(sequelize, Sequelize);
db.Order = require("./order.model")(sequelize, Sequelize);
db.Transaction = require("./tranaction.model")(sequelize, Sequelize);
db.Enrollcourse = require("./enrollcourse.model")(sequelize, Sequelize);
db.Payment = require("./payment.model")(sequelize, Sequelize);
db.Token = require("./token.model")(sequelize, Sequelize);
db.Site = require("./siteconfig.model")(sequelize, Sequelize);
db.EmailManage = require("./emailmanage.model")(sequelize, Sequelize);
db.SubscriptionPlan = require("./subscriptionplan.model")(sequelize, Sequelize);
db.Course = require("./course.model")(sequelize, Sequelize);
db.Module = require("./module.model")(sequelize, Sequelize);
db.Session = require("./session.model")(sequelize, Sequelize);
db.Order = require("./order.model")(sequelize, Sequelize);
db.Transaction = require("./tranaction.model")(sequelize, Sequelize);
db.Enrollcourse = require("./enrollcourse.model")(sequelize, Sequelize);
db.Payment = require("./payment.model")(sequelize, Sequelize);
db.Token = require("./token.model")(sequelize, Sequelize);
db.Site = require("./siteconfig.model")(sequelize, Sequelize);
db.EmailManage = require("./emailmanage.model")(sequelize, Sequelize);
db.EmailType = require("./emailtype.model")(sequelize, Sequelize);
db.EnrollCourses = require("./enrollcourse.model")(sequelize, Sequelize);

// User.hasMany(Invoice);
// Invoice.belongsTo(User);

db.Course.hasMany(db.Session, { foreignKey: "course_id" });
db.Session.belongsTo(db.Course, { foreignKey: "course_id" });

db.Module.hasMany(db.Session, { foreignKey: "module_id" });
db.Session.belongsTo(db.Module, { foreignKey: "module_id" });

db.Course.hasMany(db.Module, { foreignKey: "course_id" });
db.Module.belongsTo(db.Course, { foreignKey: "course_id" });

db.Subscription.belongsTo(db.User, { foreignKey: "user_id" });
db.User.hasMany(db.Subscription, { foreignKey: "user_id" });

db.Order.belongsTo(db.Subscription, { foreignKey: "subscription_id" });
db.Subscription.hasMany(db.Order, { foreignKey: "subscription_id" });

db.Order.belongsTo(db.User, { foreignKey: "user_id" });
db.User.hasMany(db.Order, { foreignKey: "user_id" });

db.SubscriptionPlan.belongsTo(db.User, { foreignKey: "user_id" });
db.User.hasMany(db.SubscriptionPlan, { foreignKey: "user_id" });

db.Course.hasMany(db.Enrollcourse, { foreignKey: "course_id" });
db.Enrollcourse.belongsTo(db.Course, { foreignKey: "course_id" });

db.Order.hasMany(db.Transaction, { foreignKey: "order_id" });
db.Transaction.belongsTo(db.Order, { foreignKey: "order_id" });

db.User.hasMany(db.Transaction, { foreignKey: "user_id" });
db.Transaction.belongsTo(db.User, { foreignKey: "user_id" });

//export deb
module.exports = db;
