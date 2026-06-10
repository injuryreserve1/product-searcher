import { PdfReader } from "pdfreader";
import { createWorker } from "tesseract.js";
import { pdfToImg } from "pdftoimg-js";

export async function readPDF(file: string): Promise<string> {
  const content = await new Promise<string>((resolve, reject) => {
    let tempData = "";

    new PdfReader().parseFileItems(file, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(tempData);
      else if (item.text) tempData += item.text + "";
    });
  });

  let result: string = content;

  if (result.length <= 1) {
    try {
      const images = await pdfToImg(file);
      const worker = await createWorker("rus+eng");

      let ocrText = "";

      for (const image of images) {
        const {
          data: { text },
        } = await worker.recognize(image);
        ocrText += text + "\n";
      }

      await worker.terminate();

      result = ocrText;
    } catch (err) {
      console.error("Ошибка при конвертации или OCR:", err);
    }
  }

  return result;
}
