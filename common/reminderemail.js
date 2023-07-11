const sendEmails = require("../helper/sendMails");
const { Subscription } = require("../models/index.model");
const {
  GetEmailTemplates,
  GetSubscriptionDet,
  ReplaceEmailTemplate,
} = require("./commonfunctions");

//update subscription according to expiry date
exports.UpdateSubscription = async () => {
  const subscription = await Subscription.findAll({
    where: {
      status: "active",
      isDeleted: false,
    },
  });
  if (subscription) {
    const datalength = subscription.length;
    for (var i = 0; i <= datalength - 1; i++) {
      if (subscription[i]?.dataValues?.expiry_date !== null) {
        var today = new Date();
        if (
          (subscription[i]?.dataValues?.expiry_date).toDateString() ===
          today.toDateString()
        ) {
          await Subscription.update(
            {
              status: "expired",
            },
            { where: { id: subscription[i]?.dataValues?.id } }
          );
        } else if (true) {
          //send reminder emails
          const currentDate = new Date();
          const thresholdDate = new Date();
          thresholdDate.setDate(currentDate.getDate() + 3);
          if (
            thresholdDate.toDateString() ===
            subscription[i]?.dataValues?.expiry_date.toDateString()
          ) {
            //send emails
            const ReminderEmailTemp = await GetEmailTemplates(
              (emailtype = "reminder_email")
            );
            //get subscription det
            const SubscriptionDet = await GetSubscriptionDet(
              subscription[i]?.dataValues?.id,
              subscription[i]?.dataValues?.user_id
            );
            var translations = {
              username:
                SubscriptionDet?.user?.dataValues?.first_name +
                " " +
                SubscriptionDet?.user?.dataValues?.last_name,
              loginurl: `${process.env.FRONTEND_URL}`,
              amount: SubscriptionDet?.dataValues?.price,
            };
            const translatedHtml = await ReplaceEmailTemplate(
              translations,
              ReminderEmailTemp?.dataValues?.emailbodytext
            );
            sendEmails(
              ReminderEmailTemp?.dataValues?.emailfrom,
              SubscriptionDet?.dataValues?.user?.email,
              ReminderEmailTemp?.dataValues?.emailsubject,
              translatedHtml
            );
          }
        }
      }
    }
  }
};
