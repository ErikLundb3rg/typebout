import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.PRIVATE_KEY_JWT_ACCESS as string, {
    expiresIn: '50d'
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.PRIVATE_KEY_JWT_REFRESH as string, {
    expiresIn: '10d'
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.PRIVATE_KEY_JWT_ACCESS as string);
};
