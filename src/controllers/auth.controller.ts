import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import userServices from '../services/user.service.js';
import authServices from '../services/auth.service.js';
import { Response, Request, NextFunction } from 'express';
import prisma from '../../prisma/client.js';
import tokenServices from '../services/token.service.js';
import emailServices from '../services/email.service.js';
import { AuthRequest } from '../models/request.model.js';
import moment from 'moment';
import { tokenTypes } from '../config/token.js';

const register = catchAsync(async (req: AuthRequest, res: Response) => {
  const existingUser = await userServices.getUserByEmail(req.body.email);

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const userCreated = await userServices.createUser(req.body);
  const tokens = await tokenServices.generateAuthTokens(userCreated.id);

  const userBody = {
    id: userCreated.id,
    username: userCreated.username,
    email: userCreated.email,
    age: userCreated.age,
    createdAt: moment(userCreated.createdAt).format('YYYY-MM-DD'),
    updatedAt: moment(userCreated.updatedAt).format('YYYY-MM-DD')
  };

  res.cookie('accessToken', tokens.access.token, {
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Prevent CSRF
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.cookie('userId', userCreated.id, {
    httpOnly: false, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // Prevent CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Register is successfully',
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
    where: { userId: user.id, type: tokenTypes.REFRESH },
    orderBy: { createdAt: 'desc' }
  });

  if (existingLoginUser) {
    await prisma.token.delete({
      where: {
        id: existingLoginUser.id
      }
    });
  }
  const tokens = await tokenServices.generateAuthTokens(user.id);

  // Set secure cookies (HTTP-Only, Secure, SameSite)
  res.cookie('accessToken', tokens.access.token, {
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Prevent CSRF
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.cookie('username', user.username, {
    httpOnly: false, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // Prevent CSRF
    maxAge: 60 * 60 * 1000 // 30 days
  });

  res.send({
    status: httpStatus.OK,
    message: 'Login is successfully',
    tokens,
    data: user
  });
});

const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies.refreshToken; // Ambil langsung dari cookie

  if (!refreshToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No refresh token provided!');
  }
  await authServices.logout(refreshToken);
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('username');
  res.send({
    status: httpStatus.NO_CONTENT,
    message: 'Logout is successfully'
  });
});

const refreshToken = catchAsync(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies.refreshToken; // Ambil langsung dari cookie

  if (!refreshToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No refresh token provided!');
  }
  const token = await authServices.refreshToken(refreshToken);
  res.clearCookie('accessToken');
  res.cookie('accessToken', token.access.token, {
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Prevent CSRF
    maxAge: 60 * 60 * 1000 // 1 hour
  });
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
  await authServices.resetPassword(req.query.tokens as string, req.body.newPassword);
  res.send({
    status: httpStatus.OK,
    message: 'Reset password is successfully'
  });
});

const sendVerificationEmail = catchAsync(async (req: AuthRequest, res: Response) => {
  const verifyTokenDoc = await tokenServices.generateVerifyEmailToken(req.body.id);
  const getUser = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  });

  if (!getUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email is not match with id user');
  }

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
