const fs = require("fs");
const moment = require("moment");
const PDFDocument = require("pdfkit");
const { formatePrice } = require("../../common/commonfunctions");
let fontBold = "Helvetica-Bold";

//generate  customer side receipt
function GenerateReceipt(TransactionsDetails) {
  let doc = new PDFDocument({
    size: "A4",
    margin: 50,
    orientation: "portrait",
  });
  doc
    .image("./uploads/pdflogoimage/company_logo.png", 80, 70, {
      width: 120,
      height: 40,
    })
    .fillColor("#444444");
  doc
    .fontSize(18)
    .font(fontBold)
    .text("Learning Management System", 210, 65, { align: "right" });
  doc
    .fontSize(10)
    .text("15/3, Old Palasia Main Rd, near Mehta Marketing, 452001", 211, 90, {
      align: "right",
    })
    .text("Old Palasia, Indore, Madhya Pradesh, India", 212, 107, {
      align: "right",
    })
    .moveDown();
  doc
    .fontSize(9)
    .text("Phone : +91-731-4046693", 82, 150, { align: "left" })
    .text("mangoit-lms.mangoitsol.com", 82, 163, {
      align: "left",
      link: "mangoit-lms.mangoitsol.com",
      underline: true,
    })
    .text("info@mangoitsolutions.com", 82, 176, {
      align: "left",
      link: "info@mangoitsolutions.com",
      underline: true,
    })
    .moveDown();

  doc.fontSize(18).text(`PAYMENT CONFIRMATION RECEIPT `, 5, 220, {
    align: "center",
    width: 600,
  });
  doc
    .fontSize(10)
    .text("Amount Received : ", 90, 265, { align: "left" })
    .text(
      `${"$" + formatePrice(TransactionsDetails?.transactionamount)}`,
      170,
      265,
      {
        align: "right",
      }
    )
    .moveDown();
  doc.image("./uploads/pdflogoimage/lmspaidicon.png", 350, 255, {
    width: 100,
    height: 35,
    align: "right",
  });

  doc
    .fontSize(9)
    .text("Payment Method. :  ", 90, 290, { align: "left" })
    .text(`${TransactionsDetails?.paymentmethod}`, 180, 290, { align: "left" })
    .text("Receipt no. : ", 270, 290, { align: "left" })
    .text(`${TransactionsDetails?.transactionId}`, 330, 290, { align: "left" })
    .text("Payment Received Date : ", 375, 290, { align: "left" })
    .text(
      `${moment(`${TransactionsDetails?.transactiodate}`).format(
        "MMM DD, YYYY"
      )}`,
      480,
      290,
      { align: "right" }
    )
    .moveDown();
  // // draw bounding rectangle
  doc.rect(90, 310, 235, 50).stroke();
  doc.text(` User Id    :  ${TransactionsDetails?.userId} `, 92, 320, {
    width: 410,
    align: "left",
  });
  doc.text(` User Name    :  ${TransactionsDetails?.username} `, 92, 340, {
    width: 400,
    align: "left",
  });
  // Fit the image within the dimensions
  doc.rect(325, 310, 235, 50).stroke();
  doc.fontSize(8);
  doc.text(` Order Id.  :  ${TransactionsDetails?.OrderId}`, 330, 318, {
    width: 400,
    align: "left",
  });
  doc.moveDown();
  doc.text(
    `Order Date     :  ${moment(`${TransactionsDetails?.orderdate}`).format(
      "MMM DD, YYYY"
    )}`,
    332,
    340,
    {
      width: 410,
      align: "left",
    }
  );
  // Fit the image within the dimensions
  doc.rect(90, 380, 470, 20).stroke();
  doc.text(`Subscription Plan`, 90, 388, {
    width: 300,
    align: "center",
  });
  doc.rect(405, 380, 0, 20).stroke();
  doc.text(` Amount($)`, 420, 388, {
    width: 150,
    align: "center",
  });
  // Fit the image within the dimensions
  doc.rect(90, 400, 470, 20).stroke();
  doc.text(`${TransactionsDetails?.subscriptionname}`, 90, 408, {
    width: 300,
    align: "center",
  });
  doc.rect(405, 400, 0, 20).stroke();
  doc.text(
    `${"$" + formatePrice(TransactionsDetails?.transactionamount)}`,
    420,
    408,
    {
      width: 150,
      align: "center",
    }
  );
  doc.rect(90, 447, 315, 150).stroke();
  doc.text(`TOTAL AMOUNT RECEIVED :`, 290, 465, 450, {
    width: 310,
    align: "right",
  });
  doc.rect(405, 447, 152, 150).stroke();
  doc.text(
    `${"$" + formatePrice(TransactionsDetails?.transactionamount)}`,
    472,
    465,
    560,
    {
      width: 120,
      align: "right",
    }
  );

  doc
    .image("./uploads/pdflogoimage/sign.jpeg", 120, 510, {
      width: 200,
      height: 60,
      align: "right",
    })
    .fillColor("#444444");

  doc.end();
  doc.pipe(
    fs.createWriteStream(
      `./receiptspdf/${"customer-"}${TransactionsDetails?.transactionId}.pdf`
    )
  );
}
module.exports = {
  GenerateReceipt,
};
