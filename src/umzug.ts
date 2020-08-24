import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from './sequelize';

// Create umzug instance for DB migrations
export const umzug = new Umzug({
  migrations: {
    path: './src/migrations',
    params: [
      sequelize.getQueryInterface()
    ]
  },
  storage: new SequelizeStorage({ sequelize })
});