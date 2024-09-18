import express, { NextFunction, Response } from 'express'
import { Request } from 'express';
import { HttpError } from 'http-errors';

const app = express();
//Routes 
app.get('/', (req, res) => {
    res.json({ message: "Welcome to elibs apis" });
})
app.use((err: HttpError, req:Request , res: Response, next: NextFunction) => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statusCode = err.statusCode || 500;
});
export default app;