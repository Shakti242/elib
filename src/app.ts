import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRouter from "./user/userRouter";
import { config } from "./config/config";
import globalErrorHandler from "./config/middlewares/globalErrorHandler";
import bookRouter from "./book/bookRouter";

// Initialize the Express app
const app = express();

// Apply CORS middleware with frontend domain configuration
app.use(
    cors({
        origin: config.frontendDomain,
    })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Welcome route to confirm the server is running
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to elib APIs" });
});

// User-related routes
app.use("/api/users", userRouter);

// Book-related routes
app.use("/api/books", bookRouter);

// Global error handler middleware (handles any unhandled errors)
app.use(globalErrorHandler);

// Export the app for use in the server setup
export default app;
