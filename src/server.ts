import express from 'express';
import bodyParser from 'body-parser';
import { IndexRouter } from './controllers/v0/index.router';
import { sequelize } from './sequelize';
import { migrate } from './migrate';
// import { V0MODELS } from './controllers/v0/model.index';

(async () => {
  // Test sequelize connection
  try {
    await sequelize.authenticate();
    console.log('DB connection has been established successfully.');
    // Run DB migrations
    migrate();
  } catch (e) {
    console.error(`Unable to connect to the database. Error: ${e}`);
  }

  // Sync sequelize models
  // V0MODELS.forEach( async (model) => await model.sync());

  // Initialize server with default port
  const app = express();
  const port = process.env.PORT || 8080;

  // Use bodyParser
  app.use(bodyParser.json());

  // Refer queries to the IndexRouter
  app.use('/api/v0/', IndexRouter);
  app.get('/', async (req, res) => {
    res.send('/api/v0/');
  });

  // Start server
  app.listen(port, () => {
    console.log(`server running http://localhost:${ port }`);
    console.log(`press CTRL+C to stop server`);
  })
})();