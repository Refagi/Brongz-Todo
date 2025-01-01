import moment, { Moment } from 'moment';
import config from '../../src/config/config.js';
import { tokenTypes } from '../../src/config/token.js';
import tokenServices from '../../src/services/token.service.js';
import prisma from '../../prisma/client.js';
import fakeUser from './user.fixture.js';

interface Tokens {
  token: string;
  userId: string;
  expires: Moment;
  type: string;
  blacklisted: boolean
}

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = await tokenServices.generateToken(
  fakeUser.userOne.id,
  accessTokenExpires,
  tokenTypes.ACCESS
);

const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
const userOneRefreshToken = await tokenServices.generateToken(
  fakeUser.userOne.id,
  refreshTokenExpires,
  tokenTypes.REFRESH
);

const resetPasswordTokenExpires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
const userOneResetPasswordToken = await tokenServices.generateToken(
  fakeUser.userOne.id,
  resetPasswordTokenExpires,
  tokenTypes.RESET_PASSWORD
);

const verifyEmailTokenExpires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
const userOneVerifyEmailToken = await tokenServices.generateToken(
  fakeUser.userOne.id,
  verifyEmailTokenExpires,
  tokenTypes.VERIFY_EMAIL
);

const verifyEmailTokenOne: Tokens = {
  token: userOneVerifyEmailToken,
  userId: fakeUser.userOne.id,
  expires: verifyEmailTokenExpires,
  type: tokenTypes.VERIFY_EMAIL,
  blacklisted: false
};

const refreshTokenOne: Tokens = {
  token: userOneRefreshToken,
  userId: fakeUser.userOne.id,
  expires: refreshTokenExpires,
  type: tokenTypes.REFRESH,
  blacklisted: false
};

const resetPasswordTokenOne: Tokens = {
  token: userOneResetPasswordToken,
  userId: fakeUser.userOne.id,
  expires: resetPasswordTokenExpires,
  type: tokenTypes.RESET_PASSWORD,
  blacklisted: false
};

const insertToken = async (tokens: Tokens): Promise<void> => {
  try {
    const { token, userId, expires, type, blacklisted } = tokens;
    await tokenServices.saveToken(token, userId, expires, type, blacklisted);
  } catch (err) {
    console.log(err);
  }
};

export default {
  // refreshTokenOne,
  resetPasswordTokenOne,
  refreshTokenOne,
  verifyEmailTokenOne,
  insertToken
};
