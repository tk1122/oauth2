import { Response, Request, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export default (req: Request, res: Response, next: NextFunction) => {
    const beareToken = req.headers.authorization;
    if (!beareToken) {
        return next(new Error('access denied'));
    }

    const [sign, token] = beareToken.split(' ');
    if (sign !== 'Bearer' || !token) {
        return next(new Error('token not valid'));
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as User;
    } catch (e) {
        return next(new Error('token not valid'));
    }

    return next();
};
