import jwt from 'jsonwebtoken';
import { ENV } from './env';

const JWT_SECRET = ENV.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  role: string;
}

export const signJwt = (payload: JwtPayload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
