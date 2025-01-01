import httpStatus from 'http-status';
import tokenServices from './token.service.js';
import userServices from './user.service.js';
import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import { tokenTypes } from '../config/token.js';

const login = async (email: string, password: string) => {
  const user = await userServices.getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'wrong email or password!');
  }

  if (user.isEmailVerified === false) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email not verified, Please verify your email!');
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'wrong email or password!');
  }
  return user;
};

const logout = async (tokens: string) => {
  const refreshToken = await prisma.token.findFirst({
    where: { token: tokens, type: tokenTypes.REFRESH, blacklisted: false }
  });
  if (!refreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found, you are logged out!');
  }
  await prisma.token.delete({ where: { id: refreshToken.id } });
};

const refreshToken = async (tokens: string) => {
  try {
    const refreshTokenDoc = await tokenServices.verifyToken(tokens, tokenTypes.REFRESH);

    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token!');
    }

    const user = await userServices.getUserById(refreshTokenDoc.userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    await prisma.token.delete({
      where: { id: refreshTokenDoc.id }
    });

    return tokenServices.generateAuthTokens(user.id);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate!');
  }
};

const resetPassword = async (tokens: string, newPassword: string) => {
  const resetPasswordTokenDoc = await tokenServices.verifyToken(tokens, tokenTypes.RESET_PASSWORD);

  if (!resetPasswordTokenDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token!');
  }

  const user = await userServices.getUserById(resetPasswordTokenDoc.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const getRefreshToken = await prisma.token.findFirst({
    where: { userId: user.id, type: tokenTypes.REFRESH }
  });

  if (getRefreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are logged!');
  }

  await userServices.updateUserById(user.id, { password: newPassword, updatedAt: new Date() });
  await prisma.token.deleteMany({
    where: { userId: user.id, type: tokenTypes.RESET_PASSWORD }
  });
};

const verifyEmail = async (tokens: string) => {
  const verifyEmailTokenDoc = await tokenServices.verifyToken(tokens, tokenTypes.VERIFY_EMAIL);
  if (!verifyEmailTokenDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token!');
  }

  const getUser = await userServices.getUserById(verifyEmailTokenDoc.userId);

  if (!getUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  await prisma.token.deleteMany({
    where: { userId: getUser.id, type: tokenTypes.VERIFY_EMAIL }
  });
  await userServices.updateUserById(getUser.id, { isEmailVerified: true, updatedAt: new Date() });
};

export default {
  login,
  logout,
  refreshToken,
  resetPassword,
  verifyEmail
};
