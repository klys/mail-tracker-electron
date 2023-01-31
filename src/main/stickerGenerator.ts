import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import bwipjs from 'bwip-js';
import fs from 'fs';

const stickerGenerator = async (
  name: string,
  location: string,
  sender: string,
  date: string,
  code: string
) => {
  bwipjs.toBuffer(
    {
      bcid: 'code39', // Barcode type
      text: code, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
    },
    async function (err, png) {
      if (err) {
        // `err` may be a string or Error object
      } else {
        // `png` is a Buffer
        // png.length           : PNG file length
        // png.readUInt32BE(16) : PNG image width
        // png.readUInt32BE(20) : PNG image height
        console.log('Barcode-PNG:', png);
        // buffer = Buffer.from(png.toString('base64'),'base64')

        const pdfDoc = await PDFDocument.create();
        console.log('StandardFonts:', StandardFonts);
        // Embed the Times Roman font
        const NormalFont = await pdfDoc.embedFont(StandardFonts.Courier);
        const BoldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);

        // Add a blank page to the document
        const page = pdfDoc.addPage();

        // Get the width and height of the page
        const { width, height } = page.getSize();

        // Draw a string of text toward the top of the page

        page.drawText(name, {
          x: 10,
          y: height - 10,
          size: 14,
          font: NormalFont,
          color: rgb(0, 0, 0),
        });

        page.drawText('Location:', {
          x: 50,
          y: height - 20,
          size: 10,
          font: BoldFont,
          color: rgb(0, 0, 0),
        });

        page.drawText(location, {
          x: 50,
          y: height - 30,
          size: 10,
          font: NormalFont,
          color: rgb(0, 0, 0),
        });

        page.drawText('Sender:', {
          x: 5,
          y: height - 40,
          size: 10,
          font: BoldFont,
          color: rgb(0, 0, 0),
        });

        page.drawText(sender, {
          x: 5,
          y: height - 50,
          size: 10,
          font: NormalFont,
          color: rgb(0, 0, 0),
        });

        page.drawText(date, {
          x: 5,
          y: height - 70,
          size: 10,
          font: BoldFont,
          color: rgb(0, 0, 0),
        });

        console.log(png);

        const pngImage = await pdfDoc.embedPng(png);

        const pngDims = await pngImage.scale(0.2);

        page.drawImage(pngImage, {
          x: 5,
          y: height - 100,
          width: pngDims.width,
          height: pngDims.height,
        });

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();
        // const base64pdf = window.electron.ipcRenderer.invoke('file-test', {file:pdfBytes})
        // printJS({printable: base64pdf, type:'pdf', base64: true})

        fs.writeFile(`./assets/stickers/${code}.pdf`, pdfBytes, (err) => {
          if (err) return console.log(err);
          console.log('print.pdf saved.');
          // print('./print.pdf').then(console.log);
          // middle = base64_encode('./assets/print.pdf');
        });
      }
    }
  );
};

export default stickerGenerator;
