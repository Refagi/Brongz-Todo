import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import userServices from '../services/user.service.js';
import authServices from '../services/auth.service.js';
import tokenServices from '../services/token.service.js';
import { Response, Request, NextFunction } from 'express';
import prisma from '../../prisma/client.js';
import emailServices from '../services/email.service.js';
import { AuthRequest } from '../models/request.model.js';
import { tokenTypes } from '../config/token.js';
import jwt from 'jsonwebtoken';

const register = catchAsync(async (req: AuthRequest, res: Response) => {
  const existingUser = await userServices.getUserByEmail(req.body.email);

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const userCreated = await userServices.createUser(req.body);
  const tokens = await tokenServices.generateAuthTokens(userCreated.id);

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

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Register is successfully',
    data: { userCreated, tokens }
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

  res.send({
    status: httpStatus.OK,
    message: 'Login is successfully',
    tokens,
    data: user
  });
});

const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
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
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No refresh token provided!');
  }
  const token = await authServices.refreshToken(refreshToken);
  res.cookie('accessToken', token.access.token, {
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Prevent CSRF
    maxAge: 60 * 60 * 1000 // 1 hour
  });
  res.cookie('refreshToken', token.refresh.token, {
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Prevent CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000 // 1 hour
  });
  res.send({
    status: httpStatus.OK,
    message: 'Refresh Token is successfully',
    tokens: token
  });
});

const sendVerificationEmail = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  const verifyTokenDoc = await tokenServices.generateVerifyEmailToken(req.user);

  await emailServices.sendVerificationEmail(req.user.email, verifyTokenDoc);
  res.cookie('verifyEmail', verifyTokenDoc, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000 // 15 menit
  });
  res.send({
    status: httpStatus.OK,
    message: `Verify email link has been sent to ${req.user.email}`,
    tokens: verifyTokenDoc
  });
});

const verifyEmail = catchAsync(async (req: AuthRequest, res: Response) => {
  const tokens = req.cookies.verifyEmail;
  console.log('verifyEmail', tokens);
  await authServices.verifyEmail(tokens);
  res.clearCookie('verifyEmail');
  res.send({
    status: httpStatus.OK,
    message: 'Email has been verification!'
  });
});

const protectAuth = catchAsync(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No refresh token provided!');
  }

  try {
    const validToken = await tokenServices.verifyTokenProtectAuth(refreshToken, tokenTypes.REFRESH);

    if (!validToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token!');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (typeof validToken.exp !== 'number' || validToken.exp < currentTime) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token expired!');
    }

    const user = await prisma.user.findUnique({ where: { id: validToken.sub } });
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found!');
    }

    req.user = user;

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Refresh token valid',
      payload: { userId: user.id }
    });
  } catch (error) {
    console.error('ProtectAuth error:', error);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token!');
  }
});

export default {
  register,
  login,
  logout,
  refreshToken,
  sendVerificationEmail,
  verifyEmail,
  protectAuth
};
