import { Request } from 'express';

export const getTokenFromHeader = (req: Request): string | null => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    return token || null;
};
