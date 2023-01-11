import express from 'express';
// import * as redis from "redis";
import bodyParser from 'body-parser';
import { addRoutes } from './routers';

const app = express();
const port = 1337;
// useless commen
app.use(bodyParser.json());

addRoutes(app);

app.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
