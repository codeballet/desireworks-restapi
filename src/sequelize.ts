import { Sequelize } from 'sequelize';
import { config } from './config/config';

const c = config.dev;

// Instantiate a new Sequelize instance
export const sequelize = new Sequelize(
    c.database,
    c.username,
    c.password,
    {
        host: c.host,
        dialect: 'postgres',
        logging: console.log
    }
);