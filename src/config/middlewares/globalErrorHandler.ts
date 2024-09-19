import {Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === 'development' ? err.stack : "",
    })
};
export default globalErrorHandler;