import express from 'express'
// import createHttpError from 'http-errors';
import globalErrorHandler from './config/middlewares/globalErrorHandler';
import userRouter from './user/userRouter';

const app = express();
app.use(express.json());
//Routes 
app.get('/', (_req, res) => {
    res.json({ message: "Welcome to elibs apis" });
});



app.use('/api/users', userRouter);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);
export default app;