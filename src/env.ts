import dotenv from "dotenv";

dotenv.config();

export const dbUrl = process.env.DATABASE_URL;
export const dbTestUrl = process.env.DATABASE_TEST_URL;
export const port = process.env.PORT || 5000;
export const jwtSignature = process.env.JWT_SIGNATURE || "";
export const cookieSignature = process.env.COOKIE_SIGNATURE;
export const nodeEnv = process.env.NODE_ENV || "";
export const host = process.env.HOST || "";
