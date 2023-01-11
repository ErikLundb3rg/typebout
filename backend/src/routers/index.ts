import user from './users';
import { Application } from 'express';

export const addRoutes = (app: Application): void => {
  app.use('/test', user);
};
