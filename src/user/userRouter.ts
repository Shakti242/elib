import express from 'express';
import { Request, Response } from 'express';

const userRouter = express.Router();

userRouter.post('/register', (req: Request, res: Response) => {
    res.json({ message: 'User registered' });
});

export default userRouter;