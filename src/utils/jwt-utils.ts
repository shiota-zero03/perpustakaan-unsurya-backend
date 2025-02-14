import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "perpustakaan-unsurya-secret" as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "perpustakaan-unsurya-refresh-secret" as string;
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });
};

/**
 * Verify Token
 */
export const verifyToken = (token: string, type: "access" | "refresh"): any => {
    const secret = type === "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
    return jwt.verify(token, secret);
};
