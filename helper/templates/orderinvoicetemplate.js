const fs = require("fs");
const moment = require("moment");
const PDFDocument = require("pdfkit");
const { formatePrice } = require("../../common/commonfunctions");
let fontBold = "Helvetica-Bold";

//generate admin Side invoice pdf
function GenerateInvoicePdf(OrderDetails) {
  console.log(OrderDetails);
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
    .fillColor("#668cff")
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

  doc
    .rect(215, 220, 170, 30)
    .fillAndStroke("#e8661b!")
    .fill("#FFFFFF")
    .stroke();
  doc.fontSize(20).text(`ORDER INVOICE`, 0, 230, {
    align: "center",
    width: 600,
  });
  doc
    .fontSize(10)
    .fillColor("#1a1a1a")
    .text(
      `Invoice Date  :  ${moment(`${OrderDetails?.orderdate}`).format(
        "MMM DD, YYYY"
      )}`,
      80,
      270,
      {
        align: "left",
      }
    );
  doc
    .fillColor("black")
    .text(`Invoice Id  :  ${OrderDetails?.orderId}`, 80, 282, { align: "left" })
    .moveDown();
  doc
    .fontSize(9)
    .text(`Bill to :  ${OrderDetails?.username}`, 80, 305, {
      align: "left",
    })
    .moveDown();
  doc
    .fontSize(9)
    .text(`User ID : ${OrderDetails?.userId}`, 80, 325, { align: "left" });
  doc
    .text(`User Name  : ${OrderDetails?.username}`, 80, 337, {
      align: "left",
    })
    .moveDown();
  doc.rect(80, 400, 150, 17).fillAndStroke("#e8661b", "black").fill("#ffffff");
  doc.text(`SUBSCRIPTION PLAN`, 82, 405, {
    width: 150,
    align: "left",
  });
  doc.rect(230, 400, 150, 17).fillAndStroke("#e8661b", "black").fill("#ffffff");
  doc.text(`SUBSCRIPTION TYPE`, 240, 405, {
    width: 150,
    align: "left",
  });
  doc.rect(370, 400, 175, 17).fillAndStroke("#e8661b", "black").fill("#ffffff");
  doc.text(`AMOUNT($)`, 370, 405, {
    width: 175,
    align: "center",
  });

  doc.rect(80, 417, 150, 17).fillAndStroke("white", "#1a1a1a").fill("#1a1a1a");
  doc.text(`${OrderDetails?.subscriptionname}`, 82, 422, {
    width: 150,
    align: "left",
  });
  doc.rect(230, 417, 140, 17).stroke();
  doc.text(`${OrderDetails?.subscriptiondyrationterm}`, 245, 422, {
    width: 140,
    align: "left",
  });

  doc.rect(370, 417, 175, 17).stroke();
  doc.text(`$${formatePrice(OrderDetails?.orderamount)}`, 370, 422, {
    width: 175,
    align: "center",
  });

  doc.rect(80, 480, 290, 120).stroke();
  doc.text(`Total Amount : `, 82, 485, {
    width: 270,
    align: "right",
  });
  doc.rect(370, 480, 175, 120).stroke();
  doc.text(`$${formatePrice(OrderDetails?.orderamount)}`, 370, 485, {
    width: 175,
    align: "center",
  });

  doc
    .image("./uploads/pdflogoimage/sign.jpeg", 100, 510, {
      width: 200,
      height: 60,
      align: "right",
    })
    .fillColor("#444444");

  doc.end();
  doc.pipe(
    fs.createWriteStream(
      `./invoicespdf/${"customer-"}${OrderDetails?.orderId}.pdf`
    )
  );
}
module.exports = {
  GenerateInvoicePdf,
};
