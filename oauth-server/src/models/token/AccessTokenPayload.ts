import { TokenPayload } from './TokenPayload';

export interface AccessTokenPayload extends TokenPayload {
    userId: number;
    scope: string;
}
