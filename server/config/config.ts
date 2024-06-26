import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT || 3000);

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_DIALECT = process.env.DB_DIALECT || 'mariadb';
const DB_DATABASE = process.env.DB_DATABASE || 'warriers';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD;

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRED_IN = process.env.ACCESS_TOKEN_EXPIRED_IN;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRED_IN = process.env.REFRESH_TOKEN_EXPIRED_IN;

const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const CLOUDINARY_PATH = process.env.CLOUDINARY_PATH;
const CLOUDINARY_PRESET = process.env.CLOUDINARY_PRESET;

export {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  SALT_ROUNDS,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRED_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED_IN,
  CLOUDINARY_CLOUD,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
  CLOUDINARY_PATH,
  CLOUDINARY_PRESET,
};
