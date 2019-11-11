import { TokenPayload } from './TokenPayload';

export interface RefreshTokenPayload extends TokenPayload {
    jti: string;
    scope: string;
    userId: number;
}
