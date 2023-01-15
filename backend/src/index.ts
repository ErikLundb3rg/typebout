import express from 'express';
// import * as redis from "redis";
import bodyParser from 'body-parser';
import { addRoutes } from './routers';
import passport from 'passport';
import dotenv from 'dotenv';
import { initalizePassportStrategies } from './auth/strategies';
import cookieParser from 'cookie-parser';

dotenv.config();
initalizePassportStrategies();

const port = process.env.EXPRESS_PORT || 1337;

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

addRoutes(app);

app.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
