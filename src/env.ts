import dotenv from 'dotenv';

dotenv.config();

export const dbUrl = process.env.DATABASE_URL;
export const port = process.env.PORT || 5000;
