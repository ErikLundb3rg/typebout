import express from 'express';
// import * as redis from "redis";
import bodyParser from 'body-parser';
import { addRoutes } from './routers';
import passport from 'passport';
import dotenv from 'dotenv';
import { initalizePassportStrategies } from './auth/strategies';

dotenv.config();
initalizePassportStrategies();

const app = express();
const port = 1337;
app.use(bodyParser.json());
app.use(passport.initialize());

addRoutes(app);

app.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
