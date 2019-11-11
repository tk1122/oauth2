import { TokenPayload } from '../models/token/TokenPayload';
import jwt from 'jsonwebtoken';
import { AccessTokenPayload } from '../models/token/AccessTokenPayload';
import { RefreshTokenPayload } from '../models/token/RefreshTokenPayload';

abstract class TokenCreator {
    protected abstract createPayload(payload: TokenPayload): TokenPayload;
    protected readonly expireTime = process.env.ACCESS_TOKEN_EXPIRE_TIME_MS;
    protected readonly secret = process.env.JWT_SECRET || '123456';

    encodeToken(payload: TokenPayload): Promise<string> {
        const pl = this.createPayload(payload);
        return new Promise((resolve, reject) => {
            jwt.sign(
                pl,
                this.secret,
                {
                    expiresIn: this.expireTime
                },
                (err, token) => {
                    if (err) {
                        return reject(new Error('system error'));
                    }

                    return resolve(token);
                }
            );
        });
    }
}

export class AccessTokenCreator extends TokenCreator {
    protected createPayload(payload: AccessTokenPayload): AccessTokenPayload {
        return payload;
    }
    protected readonly expireTime = process.env.ACCESS_TOKEN_EXPIRE_TIME_MS;

    encodeToken(payload: TokenPayload): Promise<string> {
        return super.encodeToken(payload);
    }
}

export class RefreshTokenCreator extends TokenCreator {
    protected createPayload(payload: RefreshTokenPayload): RefreshTokenPayload {
        return payload;
    }
    protected readonly expireTime = process.env.REFRESH_TOKEN_EXPIRE_TIME_MS;

    encodeToken(payload: TokenPayload): Promise<string> {
        return super.encodeToken(payload);
    }
}
