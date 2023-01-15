import { initializeBearerStrategy } from './http-bearer';
import { initializeJWTStrategy } from './jwt';

export const initalizePassportStrategies = () => {
  initializeBearerStrategy();
  initializeJWTStrategy();
};
