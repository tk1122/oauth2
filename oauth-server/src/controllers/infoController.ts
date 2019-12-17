import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { User } from '../models/schema/User';

const checkScope = async (req: Request, res: Response, next: any): Promise<Response> => {
    if (!req.user) {
        return next(new Error('access denied'));
    }
    return next();
};

const getUserInfo = async (req: Request, res: Response, next: any): Promise<Response> => {
    const userRepo = getConnection().getRepository(User);

    let user: User | undefined;
    if (req.user.scope === 'all') {
        user = await userRepo.findOne({
            where: {
                id: req.user.userId
            },
            select: ['username', 'age', 'email', 'name']
        });
    } else {
        const scope = req.user.scope.split(' ');
        user = await userRepo.findOne({
            where: {
                id: req.user.userId
            },
            select: ['username', 'age', 'email', 'name']
        });

        if (!user) {
            return next(new Error('user not found'));
        }

        if (!scope.includes('username')) {
            delete user.username;
        }

        if (!scope.includes('age')) {
            delete user.age;
        }

        if (!scope.includes('email')) {
            delete user.email;
        }

        if (!scope.includes('name')) {
            delete user.name;
        }
    }

    if (!user) {
        return next(new Error('user not found'));
    }

    return res.json(user);
};

export const infoController = {
    getUserInfoHandler: getUserInfo,
    checkScopeHandler: checkScope
};
