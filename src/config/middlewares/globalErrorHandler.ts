import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { config } from '../config';

const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const responseMessage = {
        message: err.message,
        errorStack: config.env === 'development' ? err.stack : '',
    };

    // Log error for internal debugging
    console.error(err);

    return res.status(statusCode).json(responseMessage);
};

export default globalErrorHandler;
