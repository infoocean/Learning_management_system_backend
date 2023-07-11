const sendEmails = async (emailFrom, emailTo, emailSub, contentData, title) => {
  const send = require("gmail-send")({
    user: emailFrom,
    pass: process.env.EMAIL_PASS,
    to: emailTo,
    subject: emailSub,
  });
  try {
    const { result, full } = await send({
      html: `${contentData}`,
      files:
        title === "Order_Invoice"
          ? `./orderinvoicepdf.pdf`
          : title === "Payment_Receipt"
          ? `./paymentReceipt.pdf`
          : "",
    });
    if (full) {
      console.log("mail sent !", result);
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = sendEmails;
