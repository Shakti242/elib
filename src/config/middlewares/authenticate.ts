import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify, JwtPayload } from "jsonwebtoken";
import { config } from "../config";

export interface AuthRequest extends Request {
  userId?: string; // Optional to avoid TS errors if `userId` is not set yet
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  // Check if Authorization header is present
  if (!token) {
    return next(createHttpError(401, "Authorization token is required."));
  }

  try {
    // Ensure token starts with 'Bearer'
    if (!token.startsWith("Bearer ")) {
      throw createHttpError(400, "Invalid token format. Expected 'Bearer <token>'.");
    }

    const parsedToken = token.split(" ")[1]; // Extract token after 'Bearer '
    const decoded = verify(parsedToken, config.jwtSecret as string) as JwtPayload;

    // Ensure the token has a `sub` property
    if (!decoded || !decoded.sub) {
      throw createHttpError(401, "Invalid token payload.");
    }

    // Attach userId to the request
    (req as AuthRequest).userId = decoded.sub;

    next(); // Proceed to the next middleware
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return next(createHttpError(401, "Token expired."));
    }
    return next(createHttpError(401, err.message || "Authentication failed."));
  }
};

export default authenticate;
