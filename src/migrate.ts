import { umzug } from './umzug';

export const migrate = async () => {
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  await umzug.up();
  // await umzug.down({ to: 0 });
}