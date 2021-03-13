import { readFileData } from "./fileUtils";
import pdfjs from "pdfjs-dist/webpack"

export const convertPdfToImage = async (file) => {
    const images = [];
    const canvas = document.createElement("canvas");
    
    const data = await readFileData(file);
    const pdf = await pdfjs.getDocument(data).promise;

    for(let index = 0; index < pdf.numPages; index++) {
        const page = await pdf.getPage(index + 1);
        const viewport = page.getViewport({ scale: 1 });
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        images.append(canvas.toDataURL());
    }
    canvas.remove();

    return images;
}