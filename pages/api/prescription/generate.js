import fs from 'fs';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';
import pdfJS from 'pdf-lib'; // Import pdf-lib module

const generatePDF = async (req, res) => {
  try {
    // Parse the JSON data from the request body
    const data = JSON.parse(req.body);
    const { fullname, medications,Sex,Age } = data;
    delete data.medications;
    delete data.fullname;
    delete data.Sex;
    delete data.Age;
    // Generate QR code and save it as an image
    var count =0;
    var id = "";
    data.QR.forEach(element => {
      count+=1;
      if(element.name === "Paracetamol"){
        element.name = 2001
        id+='2001'
      }
      else if(element.name === "Paracetamol 650"){
        element.name = 2002
        id+='2002'
      }
      else if(element.name === "Azithromycin"){
        element.name = 2003
        id+='2003'
      }
      else if(element.name === "Aspirin"){
        element.name = 2004
        id+='2004'
      }
    });

    const qrCodeData = count+ JSON.stringify(data)+id;
    const qrCodePath = './public/qr.png';
    await QRCode.toFile(qrCodePath, qrCodeData, {
      errorCorrectionLevel: 'H',
      width: 200,
      height: 200,
    });

    // Create a new PDF document
    const doc = await PDFDocument.create();
    const page = doc.addPage([1180, 1600]); // Adjust the page size as needed

    // Embed the QR code image in the PDF document
    const qrImage = await doc.embedPng(fs.readFileSync(qrCodePath));
    page.drawImage(qrImage, {
      x: 850,
      y: 100, // Adjust the position as needed
      width: 300,
      height: 300,
    });
    const logoImage = await doc.embedPng(fs.readFileSync('./public/logo.png'));
    page.drawImage(logoImage, {
      x: 50,
      y: 1300, // Adjust the position as needed
      width: 300,
      height: 225,
    });

    page.drawText("AYUSH Hospital", {
      x: 450,
      y: 1400, // Adjust the position as needed
      size: 60,
      color: rgb(0, 0, 0), 
      // Black color
    });
    page.drawText("Prescription Sheet", {
      x: 500,
      y: 1350, // Adjust the position as needed
      size: 40,
      color: rgb(0, 0, 0), 
      // Black color
    });
    page.drawText("___________________________", {
      x: 0,
      y: 1300, // Adjust the position as needed
      size: 80,
      color: rgb(0, 0, 0), // Black color
    });
    page.drawText(`Name: ${fullname}`, {
      x: 100,
      y: 1220, // Adjust the position as needed
      size: 40,
      color: rgb(0, 0, 0), // Black color
    });
    page.drawText(`Sex: ${Sex}`, {
      x: 100,
      y: 1160, // Adjust the position as needed
      size: 40,
      color: rgb(0, 0, 0), // Black color
    });
    page.drawText(`Age: ${Age}`, {
      x: 850,
      y: 1220, // Adjust the position as needed
      size: 40,
      color: rgb(0, 0, 0), // Black color
    });
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();
    page.drawText(`Date: ${day}/${month}/${year}`, {
      x: 850,
      y: 1160, // Adjust the position as needed
      size: 40,
      color: rgb(0, 0, 0), // Black color
    });
    page.drawText("___________________________", {
      x: 0,
      y: 1130, // Adjust the position as needed
      size: 80,
      color: rgb(0, 0, 0), // Black color
    });
    var cnt = 1030;
    var number = 1
    medications.forEach(element => {
      page.drawText(`${number}. ${element.name}`, {
        x: 100,
        y: cnt, // Adjust the position as needed
        size: 50,
        color: rgb(0, 0, 0), // Black color
      });
      page.drawText(`${element.qtd}`, {
        x: 900,
        y: cnt, // Adjust the position as needed
        size: 50,
        color: rgb(0, 0, 0), // Black color
      });
      page.drawText(`Usage : ${element.usage}`, {
        x: 100,
        y: cnt-50, // Adjust the position as needed
        size: 30,
        color: rgb(0, 0, 0), // Black color
      });
      cnt-=150
      number+=1
    });
    // Add text to the PDF document
    // page.drawText(JSON.stringify(data), {
    //   x: 100,
    //   y: 50, // Adjust the position as needed
    //   size: 16,
    //   color: rgb(0, 0, 0), // Black color
    // });
    console.log(1)
    
  console.log(5)
    
  const pdfBytes = await doc.save();
  fs.writeFileSync("./public/output.pdf", pdfBytes);
  console.log(13)
  // Set the appropriate content type in the response headers
  res.setHeader('Content-Type', 'application/pdf');
  console.log(14)
  // Send the PDF as a response
  res.status(200).send(pdfBytes);
  console.log(15)
} catch (err) {
  const message = { err: { code: 'internal_error', message: err.message } };
  res.status(500).send(message);
}
};

export default generatePDF;