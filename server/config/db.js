import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

//console.log(DB_NAME,DB_USER,DB_HOST,DB_NAME)

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: 3307,
    dialect: 'mysql'
});

export default sequelize;