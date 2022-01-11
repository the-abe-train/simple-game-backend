import dotenv from 'dotenv';

dotenv.config();

export const dbUrl = process.env.DATABASE_URL;
export const port = process.env.PORT || 5000;
export const jwtSignature = process.env.JWT_SIGNATURE;
export const cookieSignature = process.env.COOKIE_SIGNATURE;
