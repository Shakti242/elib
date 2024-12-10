import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return next(createHttpError(401, "Authorization token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = (decoded as { userId: string }).userId; // Assign userId to request
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

export default authenticate;
