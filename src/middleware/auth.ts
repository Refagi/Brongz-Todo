import passport from 'passport';
import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError.js';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../models/request.model.js';
import { User } from '@prisma/client';

export const attachTokenFromCookies = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  next();
};

const verifyCallback =
  (req: AuthRequest, resolve: (value?: unknown) => void, reject: (error: ApiError) => unknown) =>
  async (err: Error, user: User, info: unknown) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    resolve();
  };

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    attachTokenFromCookies(req, res, () => {
      passport.authenticate('jwt', { session: false }, (err: Error, user: User, info: unknown) => {
        if (err || !user) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;
        next();
      })(req, res, next);
    });
  } catch (err) {
    next(err);
  }
};
