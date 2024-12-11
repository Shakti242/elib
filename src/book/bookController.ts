import path from "node:path";
import fs from "node:fs";
import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import userModel from "../user/userModel";
import { AuthRequest } from "../config/middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre, description } = req.body;

    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (!files?.coverImage || !files?.file) {
            return next(createHttpError(400, "Cover image and book file are required."));
        }

        const coverImage = files.coverImage[0];
        const bookFile = files.file[0];

        const coverImagePath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            coverImage.filename
        );

        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            bookFile.filename
        );

        const coverImageUpload = await cloudinary.uploader.upload(coverImagePath, {
            filename_override: coverImage.filename,
            folder: "book-covers",
            format: coverImage.mimetype.split("/").pop(),
        });

        const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: bookFile.filename,
            folder: "book-pdfs",
            format: "pdf",
        });

        const _req = req as AuthRequest;
        const newBook = await bookModel.create({
            title,
            description,
            genre,
            author: _req.userId,
            coverImage: coverImageUpload.secure_url,
            file: bookFileUpload.secure_url,
        });

        await fs.promises.unlink(coverImagePath);
        await fs.promises.unlink(bookFilePath);

        res.status(201).json({ id: newBook._id });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error while creating the book."));
    }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, genre } = req.body;
    const bookId = req.params.bookId;

    try {
        const book = await bookModel.findById(bookId);
        if (!book) {
            return next(createHttpError(404, "Book not found."));
        }

        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "You cannot update another user's book."));
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let updatedCoverImage = book.coverImage;
        let updatedFile = book.file;

        if (files?.coverImage) {
            const coverImage = files.coverImage[0];
            const coverImagePath = path.resolve(
                __dirname,
                "../../public/data/uploads",
                coverImage.filename
            );

            const uploadResult = await cloudinary.uploader.upload(coverImagePath, {
                filename_override: coverImage.filename,
                folder: "book-covers",
                format: coverImage.mimetype.split("/").pop(),
            });

            updatedCoverImage = uploadResult.secure_url;
            await fs.promises.unlink(coverImagePath);
        }

        if (files?.file) {
            const bookFile = files.file[0];
            const bookFilePath = path.resolve(
                __dirname,
                "../../public/data/uploads",
                bookFile.filename
            );

            const uploadResult = await cloudinary.uploader.upload(bookFilePath, {
                resource_type: "raw",
                filename_override: bookFile.filename,
                folder: "book-pdfs",
                format: "pdf",
            });

            updatedFile = uploadResult.secure_url;
            await fs.promises.unlink(bookFilePath);
        }

        const updatedBook = await bookModel.findByIdAndUpdate(
            bookId,
            { title, description, genre, coverImage: updatedCoverImage, file: updatedFile },
            { new: true }
        );

        res.json(updatedBook);
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error while updating the book."));
    }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await bookModel.find().populate("author", "name");
        res.json(books);
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error while listing books."));
    }
};

const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
        const book = await bookModel.findById(bookId).populate("author", "name");
        if (!book) {
            return next(createHttpError(404, "Book not found."));
        }

        res.json(book);
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error while fetching the book."));
    }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
        const book = await bookModel.findById(bookId);
        if (!book) {
            return next(createHttpError(404, "Book not found."));
        }

        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "You cannot delete another user's book."));
        }

        const coverImagePublicId = book.coverImage.split("/").slice(-2).join("/").split(".")[0];
        const bookFilePublicId = book.file.split("/").slice(-2).join("/").split(".")[0];

        await cloudinary.uploader.destroy(coverImagePublicId);
        await cloudinary.uploader.destroy(bookFilePublicId, { resource_type: "raw" });

        await bookModel.findByIdAndDelete(bookId);

        res.send("Success");
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error while deleting the book."));
    }
};

export { createBook, updateBook, listBooks, getSingleBook, deleteBook };
