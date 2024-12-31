import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import userServices from '../services/user.service.js';
import authServices from '../services/auth.service.js';
import { Response, Request, NextFunction } from 'express';
import prisma from '../../prisma/client.js';
import { tokenTypes } from '../config/token.js';
import tokenServices from '../services/token.service.js';
import emailServices from '../services/email.service.js';
import { AuthRequest } from '../models/request.model.js';
import moment from 'moment';

const register = catchAsync(async (req: AuthRequest, res: Response) => {
  const existingUser = await userServices.getUserByEmail(req.body.email);

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const userCreated = await userServices.createUser(req.body);

  const userBody = {
    ...userCreated,
    createdAt: moment(userCreated.createdAt).format('YYYY-MM-DD'),
    updatedAt: moment(userCreated.updatedAt).format('YYYY-MM-DD')
  };

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'register is successfully',
    data: userBody
  });
});

const login = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await userServices.getUserByEmail(req.body.email);
  if (!existingUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You dont have an account yet, please register!');
  }

  const user = await authServices.login(email, password);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to login!');
  }
  const existingLoginUser = await prisma.token.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  if (existingLoginUser?.blacklisted === false && existingLoginUser.type === 'refresh') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are logged in!');
  }

  if (existingLoginUser?.type === 'refresh') {
    await prisma.token.delete({
      where: {
        id: user.id
      }
    });
  }
  const tokens = await tokenServices.generateAuthTokens(user.id);
  const userBody = {
    ...user,
    createdAt: moment(user.createdAt).format('YYYY-MM-DD'),
    updatedAt: moment(user.updatedAt).format('YYYY-MM-DD')
  };

  res.send({
    status: httpStatus.OK,
    message: 'Login is successfully',
    data: userBody,
    tokens
  });
});

const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  await authServices.logout(req.body.tokens);
  res.send({
    status: httpStatus.NO_CONTENT,
    message: 'Logout is successfully'
  });
});

const refreshToken = catchAsync(async (req: AuthRequest, res: Response) => {
  const token = await authServices.refreshToken(req.body.tokens);
  res.send({
    status: httpStatus.OK,
    message: 'Refresh Token is successfully',
    tokens: token
  });
});

const forgotPassword = catchAsync(async (req: AuthRequest, res: Response) => {
  const resetPasswordToken = await tokenServices.generateResetPasswordToken(req.body.email);
  await emailServices.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.send({
    status: httpStatus.OK,
    message: `Reset password link has been sent to ${req.body.email}`,
    tokens: resetPasswordToken
  });
});

const resetPassword = catchAsync(async (req: AuthRequest, res: Response) => {
  const reset = await authServices.resetPassword(req.query.tokens as string, req.body.newPassword);
  res.send({
    status: httpStatus.OK,
    message: 'Reset password is successfully',
    data: reset
  });
});

const sendVerificationEmail = catchAsync(async (req: AuthRequest, res: Response) => {
  const verifyTokenDoc = await tokenServices.generateVerifyEmailToken(req.body.id);
  await emailServices.sendVerificationEmail(req.body.email, verifyTokenDoc);
  res.send({
    status: httpStatus.OK,
    message: `Verify email link has been sent to ${req.body.email}`,
    tokens: verifyTokenDoc
  });
});

const verifyEmail = catchAsync(async (req: AuthRequest, res: Response) => {
  const tokens = req.query.tokens as string;
  await authServices.verifyEmail(tokens);
  res.send({
    status: httpStatus.OK,
    message: 'Email has been verification!'
  });
});

export default {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
