import { NextFunction, Request, Response } from 'express';

export default (err: Error, req: Request, res: Response, next: NextFunction): Response => {
    return res.status(400).send({ message: err.message, success: false });
};
