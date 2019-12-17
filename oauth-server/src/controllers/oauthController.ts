import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';
import { OAuthApp } from '../models/schema/OAuthApp';
import { v4 as uuid } from 'uuid';
import { OAuthRequest } from '../models/schema/OAuthRequest';
import shajs from 'sha.js';
import { AccessTokenCreator } from '../utils/encodeAccessToken';
import { AccessTokenPayload } from '../models/token/AccessTokenPayload';
import { User } from '../models/schema/User';
import bcrypt from 'bcrypt';
import { RefreshToken } from '../models/schema/RefreshToken';

const checkScope = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.scope !== 'all') {
        return next(new Error('access denied'));
    }

    return next();
};

const enum ResponseType {
    code = 'code'
}
const createOauthRequest = async (req: Request, res: Response, next: any): Promise<Response> => {
    const {
        scope,
        redirect_uri: redirectUri,
        response_type: responseType,
        client_id: clientId,
        state,
        code_challenge: codeChallenge
    } = req.body;

    console.log(req.body);

    const authCodeExpireTime = process.env.AUTH_CODE_EXPIRE_TIME_MS || 60000000;
    const appRepository = getConnection().getRepository(OAuthApp);
    const requestRepository = getConnection().getRepository(OAuthRequest);
    const userRepository = getConnection().getRepository(User);

    switch (responseType) {
        case ResponseType.code: {
            const app = await appRepository.findOne({
                redirectUri,
                clientId,
                scope
            });

            if (!app) {
                return next(new Error('client_id not found'));
            }

            const user = await userRepository.findOne({
                where: {
                    id: req.user.userId
                }
            });

            const code = uuid();
            const request = requestRepository.create({
                app,
                user,
                code,
                scope,
                expiresAt: new Date(Date.now() + +authCodeExpireTime),
                codeChallenge
            });
            await requestRepository.save(request);

            return res.json({
                code,
                state
            });
        }

        default:
            return next(new Error('response_type not supported'));
    }
};

const enum GrantType {
    password = 'password',
    authorizationCode = 'authorization_code',
    refreshToken = 'refresh_token'
}
const getAccessToken = async (req: Request, res: Response, next: any): Promise<Response> => {
    const {
        grant_type: grantType,
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        refresh_token: refreshToken,
        username,
        password,
        code_verifier: codeVerifier
    } = req.body;

    const appRepository = getConnection().getRepository(OAuthApp);
    const requestRepository = getConnection().getRepository(OAuthRequest);
    const userRepository = getConnection().getRepository(User);
    const refreshTokenRepository = getConnection().getRepository(RefreshToken);

    switch (grantType) {
        case GrantType.authorizationCode: {
            const request = await requestRepository
                .createQueryBuilder('r')
                .select()
                .innerJoinAndSelect('r.app', 'a')
                .innerJoinAndSelect('r.user', 'u')
                .getOne();

            if (!request) {
                return next(new Error('code not valid'));
            }

            // if (request.expiresAt.getTime() < Date.now()) {
            //     return next(new Error('code expired'));
            // }

            if (request.codeChallenge) {
                const challenger = new shajs.sha256().update(codeVerifier).digest('hex');
                if (challenger !== request.codeChallenge) {
                    return next(new Error('code challenge failed'));
                }
            }

            console.log(request);

            const app = await appRepository.findOne({
                id: request.app.id,
                clientId
            });

            console.log(app);

            // confidential app have client secret, SPA don't
            if (!app || (app.clientSecret && app.clientSecret !== clientSecret)) {
                return next(new Error('keys mismatched'));
            }

            if (app.redirectUri !== redirectUri) {
                return next(new Error('redirect_uri mismatched'));
            }

            const accessTokenPayload: AccessTokenPayload = {
                userId: request.user.id,
                scope: request.scope,
                iss: 'Identity'
            };

            const jti = uuid();
            const refreshToken = refreshTokenRepository.create({
                jti,
                request
            });

            try {
                const accessToken = await new AccessTokenCreator().encodeToken(accessTokenPayload);
                // if everything ok, expire the authorization code

                request.expiresAt = new Date();
                await refreshTokenRepository.save(refreshToken);
                await requestRepository.save(request);

                return res.json({
                    accessToken,
                    refreshToken: jti
                });
            } catch (e) {
                return next(e);
            }
        }

        case GrantType.password: {
            const user = await userRepository.findOne({
                where: {
                    username
                }
            });

            if (!user) {
                return next(new Error('user not found'));
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return next(new Error('user not found'));
            }

            try {
                const accessTokenPayload: AccessTokenPayload = {
                    iss: 'Identity',
                    userId: user.id,
                    scope: 'all'
                };

                const accessToken = await new AccessTokenCreator().encodeToken(accessTokenPayload);

                return res.json({
                    success: true,
                    accessToken
                });
            } catch (e) {
                return next(e);
            }
        }

        case GrantType.refreshToken: {
            const storedRefreshToken = await refreshTokenRepository.findOne({
                where: {
                    jti: refreshToken
                }
            });

            if (!storedRefreshToken) {
                return next(new Error('token revorked'));
            }

            const {
                request: {
                    scope,
                    user: { id: userId },
                    app: { clientId: cid, clientSecret: csr, redirectUri: ru }
                }
            } = storedRefreshToken;

            if (clientId !== cid || clientSecret !== csr) {
                return next(new Error('app mismatched'));
            }

            if (redirectUri !== ru) {
                return next(new Error('redirect_uri mismatched'));
            }

            try {
                const {} = storedRefreshToken;
                const accessTokenPayload: AccessTokenPayload = {
                    iss: 'Identity',
                    userId,
                    scope
                };

                const accessToken = await new AccessTokenCreator().encodeToken(accessTokenPayload);

                return res.json({
                    accessToken
                });
            } catch (e) {
                return next(e);
            }
        }

        default:
            return next(new Error('grant_type not supported'));
    }
};

export const oauthController = {
    createOauthRequestHandler: createOauthRequest,
    getAccessTokenHandler: getAccessToken,
    checkScopeHandler: checkScope
};
