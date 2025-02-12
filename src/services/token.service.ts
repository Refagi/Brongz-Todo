import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import config from '../config/config.js';
import { PayloadType } from '../models/payload.model.js';
import { tokenTypes } from '../config/token.js';
import prisma from '../../prisma/client.js';
import { Token, User } from '@prisma/client';
import userServices from './user.service.js';
import { ApiError } from '../utils/ApiError.js';

const generateToken = async (userId: string, expires: Moment, type: string, secret: string = config.jwt.secret) => {
  const payload: PayloadType = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  token: string,
  userId: string,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<Token> => {
  const tokenDoc: Token = await prisma.token.create({
    data: {
      token,
      userId: userId,
      expires: expires.toDate(),
      type,
      blacklisted
    }
  });
  return tokenDoc;
};

const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload;
  const tokenDoc = await prisma.token.findFirst({
    where: { token, type, userId: payload.sub as string, blacklisted: false }
  });

  return tokenDoc;
};

const getPayloadVerifyToken = async (token: string) => {
  const payload = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload;
  return payload;
};

const generateAuthTokens = async (userId: string) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = await generateToken(userId, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = await generateToken(userId, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, userId, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

const generateRefreshToken = async (userId: string) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = await generateToken(userId, accessTokenExpires, tokenTypes.ACCESS);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    }
  };
};

const generateResetPasswordToken = async (email: string) => {
  const user = await userServices.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email!');
  }

  await prisma.token.deleteMany({
    where: {
      userId: user.id,
      type: tokenTypes.RESET_PASSWORD
    }
  });

  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = await generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (userId: string) => {
  const user = await userServices.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this id!');
  }
  await prisma.token.deleteMany({
    where: {
      userId: user.id,
      type: tokenTypes.VERIFY_EMAIL
    }
  });
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = await generateToken(userId, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, userId, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateRefreshToken,
  getPayloadVerifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};
