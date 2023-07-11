const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const roleRouter = require("./routes/role.router");
const userRouter = require("./routes/user.router");
const courseRouter = require("./routes/course.router");
const moduleRouter = require("./routes/module.router");
const sessionRouter = require("./routes/session.router");
const subscriptionRouter = require("./routes/subscription.router");
const orderRoutes = require("./routes/order.router");
const transactionRoutes = require("./routes/transaction.router");
const enrollcourseRouter = require("./routes/enrollcourse.router");
const paymentRouter = require("./routes/payment.router");
const siteRouter = require("./routes/siteConfig.router");
const emailRouter = require("./routes/emailManage.router");
const emailTypeRouter = require("./routes/emailType.router");
const dashboard = require("./routes/dashboard.router");
const nodeCron = require("node-cron");
const { UpdateSubscription } = require("./common/reminderemail");
const app = express();
const port = process.env.PORT;

app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(roleRouter);
app.use(userRouter);
app.use(courseRouter);
app.use(moduleRouter);
app.use(sessionRouter);
app.use(subscriptionRouter);
app.use(orderRoutes);
app.use(transactionRoutes);
app.use(enrollcourseRouter);
app.use(paymentRouter);
app.use(siteRouter);
app.use(emailRouter);
app.use(emailTypeRouter);
app.use(dashboard);

//update subscription and send email
nodeCron.schedule("0 0 * * *", async function () {
  UpdateSubscription();
});

// //testing run this fun every 2 seconds
// nodeCron.schedule(" */5 * * * * *", async function () {
//   console.log("hii");
// });

app.listen(port, () => {
  console.log(`Server Connected Successfully at ${port}`);
});
