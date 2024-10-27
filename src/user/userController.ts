/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    //Validation
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = createHttpError(400, "Invalid username or password");
        return next(error);
    }
    //Process
    //response

    res.json({ message: 'User Created' });

}

export { createUser };