import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { User } from '../models/schema/User';

const checkScope = async (req: Request, res: Response, next: any): Promise<Response> => {
    if (!req.user || (req.user.scope !== 'public' && req.user.scope !== 'all')) {
        return next(new Error('access denied'));
    }
    return next();
};

const getUserInfo = async (req: Request, res: Response, next: any): Promise<Response> => {
    const userRepo = getConnection().getRepository(User);

    const user = await userRepo.findOne({
        where: {
            id: req.user.userId
        },
        select: ['username', 'age', 'email', 'name']
    });

    if (!user) {
        return next(new Error('user not found'));
    }

    return res.json(user);
};

export const infoController = {
    getUserInfoHandler: getUserInfo,
    checkScopeHandler: checkScope
};
