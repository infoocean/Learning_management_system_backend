const db = require("../models/index.model");
require("dotenv").config();
const fs = require("fs");
const jsonwebtoken = require("jsonwebtoken");
const {
  GetTransactionsDetails,
  GetEmailTemplates,
  ReplaceEmailTemplate,
} = require("../common/commonfunctions");
const { GenerateReceipt } = require("../helper/templates/receipttemplate");
const sendEmails = require("../helper/sendMails");
const {
  GenerateUserReceiptPdf,
} = require("../helper/templates/paymentreceipt");
const Transaction = db.Transaction;

exports.createTransaction = async (req, res) => {
  const {
    order_id,
    user_id,
    payment_method,
    transaction_id,
    createdAt,
    trx_amount,
  } = req.body;

  //   const token = req.headers.logintoken;
  //   const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  //   const login_user = decode.id;

  try {
    // const findUser = await User.findOne({ where: { id: login_user } });

    // if (!(findUser.role_id == 1)) {
    //   //learner user
    const transactionCreate = await Transaction.create({
      order_id: order_id,
      user_id: user_id,
      payment_method: payment_method,
      transaction_id: transaction_id,
      createdAt: createdAt,
      trx_amount: trx_amount,
    });
    if (transactionCreate) {
      //generate payment receipt
      const InvoiceTrxDet = await GetTransactionsDetails(
        transactionCreate?.dataValues?.id
      );
      const trxdetls = {
        transactionId: InvoiceTrxDet?.dataValues?.id,
        OrderId: InvoiceTrxDet?.dataValues?.order_id,
        userId: InvoiceTrxDet?.dataValues?.user_id,
        transactionamount: InvoiceTrxDet?.dataValues?.trx_amount,
        paymentmethod: InvoiceTrxDet?.dataValues?.payment_method,
        transactiodate: InvoiceTrxDet?.dataValues?.createdAt,
        subscriptionname: InvoiceTrxDet?.order?.subscription?.name,
        subscriptionduration: InvoiceTrxDet?.order?.subscription?.duration_term,
        subscriptiondurationvalue:
          InvoiceTrxDet?.order?.subscription?.duration_value,
        subscriptionstartdate: InvoiceTrxDet?.order?.subscription?.start_date,
        orderdate: InvoiceTrxDet?.order?.createdAt,
        username:
          InvoiceTrxDet?.user?.first_name +
          "" +
          "" +
          InvoiceTrxDet?.user?.last_name,
      };
      await GenerateUserReceiptPdf(trxdetls);
      //send emails
      const TransactionEmailTemp = await GetEmailTemplates(
        (emailtype = "payment_receipt")
      );
      //get subscription det after creatting subscription
      const TransactionDet = await GetTransactionsDetails(
        transactionCreate?.dataValues?.id
      );
      var translations = {
        username:
          TransactionDet?.user?.first_name +
          " " +
          TransactionDet?.user?.last_name,
        loginurl: `${process.env.FRONTEND_URL}`,
        amount: TransactionDet?.dataValues?.trx_amount,
      };
      const translatedHtml = await ReplaceEmailTemplate(
        translations,
        TransactionEmailTemp?.dataValues?.emailbodytext
      );
      sendEmails(
        TransactionEmailTemp?.dataValues?.emailfrom,
        TransactionDet?.dataValues?.user?.email,
        TransactionEmailTemp?.dataValues?.emailsubject,
        translatedHtml,
        (title = "Payment_Receipt")
      );
    }
    res.status(201).json(transactionCreate);

    // }

    // if (findUser.role_id == 1) {
    //   //admin user
    //   const transactionCreate = await Transaction.create({
    //     order_id: order_id,
    //     user_id: user_id,
    //     payment_method: payment_method,
    //     transaction_id: transaction_id,
    //     created_by: login_user,
    //   });
    //   res.status(201).json(transactionCreate);
    // }
  } catch (e) {
    res.status(400).json(e);
  }
};

//get transaction details
exports.getTransactionDet = async (req, res) => {
  const order_id = req.params.id;
  try {
    const transactionDetails = await Transaction.findOne({
      where: { order_id: order_id },
    });
    res.status(201).json(transactionDetails);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const { order_id, user_id, payment_method, transaction_id } = req.body;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const updated_by = decode.id;

  const transactionUpdate = Transaction.update(
    {
      order_id: order_id,
      user_id: user_id,
      payment_method: payment_method,
      transaction_id: transaction_id,
      updated_by: updated_by,
    },
    {
      where: { id: transactionId },
    }
  );
  const newUpdatedTransaction = await Transaction.findOne({
    where: { id: transactionId },
  });
  res.status(201).json(newUpdatedTransaction);
};

exports.deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;

  const token = req.headers.logintoken;
  const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY);
  const deleted_by = decode.id;

  try {
    const transactionDelete = await Transaction.update(
      {
        is_deleted: true,
        deleted_by: deleted_by,
      },
      { where: { id: transactionId } }
    );

    const transactiinDeleted = await Transaction.findOne({
      where: { id: transactionId },
    });
    res.status(201).json(transactiinDeleted);
  } catch (e) {
    res.status(400).json(e);
  }
};

//download payment receipr
exports.DownloadReceiptUsingTRXIdAfterPay = async (req, res) => {
  const { transactionId } = req.body;
  //get  tranaction  details
  const InvoiceTrxDet = await GetTransactionsDetails(transactionId);
  const trxdetls = {
    transactionId: InvoiceTrxDet?.dataValues?.id,
    OrderId: InvoiceTrxDet?.dataValues?.order_id,
    userId: InvoiceTrxDet?.dataValues?.user_id,
    transactionamount: InvoiceTrxDet?.dataValues?.trx_amount,
    paymentmethod: InvoiceTrxDet?.dataValues?.payment_method,
    transactiodate: InvoiceTrxDet?.dataValues?.createdAt,
    subscriptionname: InvoiceTrxDet?.order?.subscription?.name,
    subscriptionduration: InvoiceTrxDet?.order?.subscription?.duration_term,
    subscriptiondurationvalue:
      InvoiceTrxDet?.order?.subscription?.duration_value,
    subscriptionstartdate: InvoiceTrxDet?.order?.subscription?.start_date,
    orderdate: InvoiceTrxDet?.order?.createdAt,
    username:
      InvoiceTrxDet?.user?.first_name +
      "" +
      "" +
      InvoiceTrxDet?.user?.last_name,
  };
  var filePath = `receiptspdf/${"customer-"}${transactionId}.pdf`;
  fs.access(filePath, fs.constants.F_OK, async (err) => {
    if (err) {
      //create invoice pdf
      //if receipt not exists in the folder so, create
      await GenerateReceipt(trxdetls);
      setTimeout(() => {
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      }, 1000);
    } else {
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }
  });
};
