const db = require("../models/index.model");
const EmailManage = db.EmailManage;
const Subscription = db.Subscription;
//function for get stripe key
exports.getStripeKeys = async () => {
  var attributes = ["key", "value"];
  stripeKeys = await db.Site.findAll({
    where: { key: `org_sk` },
    attributes: attributes,
  });
  return stripeKeys;
};

//functions for get transactions details
exports.GetTransactionsDetails = async (transactionId) => {
  const transactiondet = await db.Transaction.findOne({
    include: [
      {
        model: db.Order,
        //attributes: [],
        include: [
          {
            model: db.Subscription,
            // attributes: [],
          },
        ],
      },
      {
        model: db.User,
        //attributes: [],
      },
    ],
    where: {
      id: transactionId,
    },
  });
  return transactiondet;
};

//function for getorder details
exports.GetOrderDetails = async (orderId) => {
  const orderDet = await db.Order.findOne({
    include: [
      {
        model: db.Subscription,
        //attributes: [],
      },
      {
        model: db.User,
        //attributes: [],
      },
    ],
    where: {
      id: orderId,
    },
  });
  return orderDet;
};

//function for formated amount
exports.formatePrice = (price) => {
  const formattedNumber = price?.toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formattedNumber;
};

//reapace html content with variable
//replace email content (template)
exports.ReplaceEmailTemplate = (translations, emailBodyText) => {
  var chunks = `${emailBodyText}`.split(/({{[a-z.]+}})/g);
  var chunksTranslated = chunks.map(function (chunk) {
    if (chunk.slice(0, 2) === "{{" && chunk.slice(-2) === "}}") {
      var id = chunk.slice(2, -2);
      return translations[id];
    }
    return chunk;
  });
  var translatedHtml = chunksTranslated.join("");
  return translatedHtml;
};

//get email templates from db
exports.GetEmailTemplates = async (emailtype) => {
  const emailTemplatedata = await EmailManage.findOne({
    where: { emailtype: emailtype },
    attributes: ["emailbodytext", "emailsubject", "emailfrom"],
  });
  return emailTemplatedata;
};

//get subscription det by id
exports.GetSubscriptionDet = async (subscriptionid, user_id) => {
  const subscdet = await Subscription.findOne({
    include: [
      {
        model: db.User,
        //attributes: [],
      },
    ],
    where: { id: subscriptionid, user_id: user_id },
  });
  return subscdet;
};


