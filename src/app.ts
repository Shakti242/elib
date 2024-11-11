import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import { config } from "./config/config";
import globalErrorHandler from "./config/middlewares/globalErrorHandler";

const app = express();

// app.use(
//     cors({
//         origin: config.frontendDomain,
//     })
// );

app.use(express.json());

// Routes
// Http methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res, next) => {
    res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;