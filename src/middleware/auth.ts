import passport from 'passport';
import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError.js';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../models/request.model.js';
import { User } from '@prisma/client';

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
    await new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    });
    next();
  } catch (err) {
    next(err);
  }
};
