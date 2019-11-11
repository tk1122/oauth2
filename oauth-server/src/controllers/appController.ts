import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { OAuthApp } from '../models/schema/OAuthApp';
import { v4 as uuid } from 'uuid';
import { User } from '../models/schema/User';

const checkScope = async (req: Request, res: Response, next: any): Promise<Response> => {
    if (!req.user || req.user.scope !== 'all') {
        return next(new Error('access denied'));
    }
    return next();
};

const creatOauthApp = async (req: Request, res: Response, next: any): Promise<Response> => {
    const { name, scope, redirect_uri: redirectUri } = req.body;
    const appRepo = getConnection().getRepository(OAuthApp);
    const userRepo = getConnection().getRepository(User);

    const user = await userRepo.findOne({
        where: {
            id: req.user.userId
        }
    });

    if (!user) {
        return next(new Error('user not found'));
    }

    const app = appRepo.create({
        name,
        scope,
        redirectUri,
        clientId: uuid(),
        clientSecret: uuid(),
        user
    });

    await appRepo.save(app);

    return res.json({ clientId: app.clientId, clientSecret: app.clientSecret });
};

const getOauthApps = async (req: Request, res: Response, next: any): Promise<Response> => {
    const userRepo = getConnection().getRepository(User);

    const user = await userRepo.findOne({
        where: {
            id: req.user.userId
        }
    });

    if (!user) {
        return next(new Error('user not found'));
    }

    const apps = user.apps;
    if (!apps || apps.length === 0) {
        return next(new Error('app not found'));
    }

    return res.json({
        apps: apps.map(a => ({
            name: a.name,
            scope: a.scope
        }))
    });
};

const getOAuthApp = async (req: Request, res: Response, next: any): Promise<Response> => {
    const { scope, redirect_uri: redirectUri, client_id: clientId } = req.body;
    const appRepository = getConnection().getRepository(OAuthApp);

    const app = await appRepository.findOne({
        where: {
            scope,
            redirectUri,
            clientId
        }
    });

    if (!app) {
        return next(new Error('app mismatched'));
    }

    return res.json({
        name: app.name,
        scope: app.scope
    });
};

export const appController = {
    createOauthAppHandler: creatOauthApp,
    getOAuthAppsHandler: getOauthApps,
    getOAuthAppHandler: getOAuthApp,
    checkScopeHandler: checkScope
};
