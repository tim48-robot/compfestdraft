import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    API_KEY : process.env.API_KEY;
    DB_URL : process.env.DB_URL;
}