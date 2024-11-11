import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
    // const{} = req.body;
    console.log("files", req.files);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeTypes = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
    );
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: 'book_covers',
        format: coverImageMimeTypes
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
    );
    const bookFileUploadResult = await cloudinary.uploader.upload(
        bookFilePath,
        {
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "book-pdfs",
            format: "pdf",
        }
    );

    console.log('BOOK FILE UPLOAD RESULT', bookFileUploadResult)

    console.log('UPLOAD RESULT', uploadResult);

    res.json({})
};


export { createBook }
