import request from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import app from '../../src/app.js';
import prisma from '../../prisma/client.js';
import { RequestCreateUser, RequestLoginUser, RequestVerifyUser } from '../../src/models/user.model.js';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fakeUser from '../fixtures/user.fixture.js';
import fakeToken from '../fixtures/token.fixture.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../../src/utils/ApiError.js';
import bcrypt from 'bcryptjs';
import { aw } from 'vitest/dist/chunks/reporters.D7Jzd9GS.js';
import { token } from 'morgan';
import exp from 'constants';

describe('Auth Route', () => {
  beforeEach(async () => {
    // Menghapus data user dan token sebelum setiap test
    await prisma.user.deleteMany();
    await prisma.token.deleteMany();
  });

  afterEach(async () => {
    // Menghapus data user dan token setelah setiap test
    await prisma.user.deleteMany();
    await prisma.token.deleteMany();
  });

  describe.skip('POST v1/auth/register', () => {
    let newUser: RequestCreateUser;

    beforeEach(() => {
      newUser = {
        username: 'kiplii',
        email: 'kiplii@gmail.com',
        password: 'kiplii#$11',
        age: 20
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);
      const userData = res.body.data;

      expect(userData).toMatchObject({
        id: expect.anything(),
        username: newUser.username,
        password: expect.anything(),
        email: newUser.email,
        age: newUser.age,
        createdAt: expect.anything(),
        updatedAt: expect.anything()
      });

      const dbUser = await prisma.user.findUnique({
        where: {
          id: userData.id
        }
      });

      expect(dbUser).toBeDefined();
      expect(dbUser?.password).not.toBe(newUser.password);

      expect(dbUser).toMatchObject({
        id: expect.anything(),
        username: newUser.username,
        password: expect.anything(),
        email: newUser.email,
        age: newUser.age,
        createdAt: expect.anything(),
        updatedAt: expect.anything()
      });
    });

    test('should return 400 error if email is invalid', async () => {
      newUser.email = 'brongz.yahoo.com'; // Email invalid

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already taken', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      newUser.email = fakeUser.userOne.email;

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'short';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain at least 1 letter, number, and special character', async () => {
      newUser.password = 'password';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if age is not positive number', async () => {
      newUser.age = -20;

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe.skip('POST v1/auth/send-verification-email', async () => {
    test('should retrurn 200 ok if send verification email successfully', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      let sendVerify = {
        id: fakeUser.userOne.id,
        email: fakeUser.userOne.email
      };
      const res = await request(app).post('/v1/auth/send-verification-email').send(sendVerify).expect(httpStatus.OK);

      expect(res.body.tokens).toStrictEqual(expect.anything());
    });

    test('should retrurn 404 error if id user is not found', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      let sendVerify = {
        id: 'jbidaus-dasueore-jdfskddfksj-vsdjfsadfi',
        email: fakeUser.userOne.email
      };

      await request(app).post('/v1/auth/send-verification-email').send(sendVerify).expect(httpStatus.NOT_FOUND);
    });

    test('should retrurn 404 error if email user is not match with id user', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      let sendVerify = {
        id: fakeUser.userOne.id,
        email: 'brongz@gmail.com'
      };

      await request(app).post('/v1/auth/send-verification-email').send(sendVerify).expect(httpStatus.NOT_FOUND);
    });
  });

  describe.skip('POST v1/auth/verify-email', async () => {
    test('should return 200 ok if verify email successfully', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      const tokens = fakeToken.verifyEmailTokenOne;
      await fakeToken.insertToken(tokens);

      const res = await request(app)
        .post('/v1/auth/verify-email')
        .query({ tokens: tokens.token })
        .expect(httpStatus.OK);
      expect(res.body.message).toEqual('Email has been verification!');
    });

    test('should return 401 error if token is not valid', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      const tokens = fakeToken.verifyEmailTokenOne;
      await fakeToken.insertToken({ ...tokens, blacklisted: true });

      await request(app).post('/v1/auth/verify-email').query({ tokens: tokens.token }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if token is not exists', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      const tokens = fakeToken.verifyEmailTokenOne;

      await request(app).post('/v1/auth/verify-email').query(tokens).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe.skip('POST v1/auth/login', async () => {
    test('should return 200 ok if login successfully', async () => {
      await fakeUser.insertUsers({ ...fakeUser.userOne, isEmailVerified: true });
      let login: RequestLoginUser = {
        email: fakeUser.userOne.email,
        password: 'kiplii#$11'
      };

      const res = await request(app).post('/v1/auth/login').send(login).expect(httpStatus.OK);

      expect(res.body.data).toEqual({
        id: expect.anything(),
        username: fakeUser.userOne.username,
        email: fakeUser.userOne.email,
        password: expect.anything(),
        age: fakeUser.userOne.age,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        isEmailVerified: true
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() }
      });
    });

    test('should retuen 404 error if wrong email', async () => {
      await fakeUser.insertUsers({ ...fakeUser.userOne, isEmailVerified: true });
      let login: RequestLoginUser = {
        email: '',
        password: 'kiplii#$11'
      };

      await request(app).post('/v1/auth/login').send(login).expect(httpStatus.BAD_REQUEST);
    });

    test('should retuen 404 error if wrong password', async () => {
      await fakeUser.insertUsers({ ...fakeUser.userOne, isEmailVerified: true });
      let login: RequestLoginUser = {
        email: fakeUser.userOne.email,
        password: 'wrongPassword11#$'
      };

      await request(app).post('/v1/auth/login').send(login).expect(httpStatus.BAD_REQUEST);
    });

    test('should retuen 401 error if email is not registered', async () => {
      await fakeUser.insertUsers({ ...fakeUser.userOne, isEmailVerified: false });
      let login: RequestLoginUser = {
        email: fakeUser.userTwo.email,
        password: 'kiplii#$11'
      };

      await request(app).post('/v1/auth/login').send(login).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe.skip('POST v1/auth/logout', async () => {
    test('should return 200 ok if logout is succeesfully ', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken(fakeToken.refreshTokenOne);

      const res = await request(app)
        .post('/v1/auth/logout')
        .send({ tokens: fakeToken.refreshTokenOne.token })
        .expect(httpStatus.OK);
      expect(res.body.status).toEqual(httpStatus.NO_CONTENT);
      expect(res.body.message).toEqual('Logout is successfully');
    });

    test('should return 404 not found if token refresh is not found', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken(fakeToken.verifyEmailTokenOne);

      await request(app)
        .post('/v1/auth/logout')
        .send({ tokens: fakeToken.refreshTokenOne.token })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe.skip('POST v1/auth/refresh-token', async () => {
    test('should return 200 ok if refresh token is successfully', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken(fakeToken.refreshTokenOne);

      const res = await request(app)
        .post('/v1/auth/refresh-token')
        .send({ tokens: fakeToken.refreshTokenOne.token })
        .expect(httpStatus.OK);

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() }
      });
    });

    test('should return 401 error if token is not valid', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken({ ...fakeToken.refreshTokenOne, blacklisted: true });

      await request(app)
        .post('/v1/auth/refresh-token')
        .send({ tokens: fakeToken.refreshTokenOne.token })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe.skip('POST v1/auth/forgot-password', async () => {
    test('should return 200 ok if forgot passsword is successfully', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken(fakeToken.resetPasswordTokenOne);
      let sendEmail = { email: fakeUser.userOne.email };

      const res = await request(app).post('/v1/auth/forgot-password').send(sendEmail).expect(httpStatus.OK);
      expect(res.body.tokens).toStrictEqual(expect.anything());
    });

    test('should return 404 error if email is not found', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken(fakeToken.resetPasswordTokenOne);
      let sendEmail = { email: fakeUser.userTwo.email };
      await request(app).post('/v1/auth/forgot-password').send(sendEmail).expect(httpStatus.NOT_FOUND);
    });
  });

  describe('POST v1/auth/reset-password', async () => {
    test('should return 200 ok if reset password is successfully', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken(fakeToken.resetPasswordTokenOne);

      let sendPassword = { newPassword: 'newPassword11#@' };

      await request(app)
        .post('/v1/auth/reset-password')
        .query({ tokens: fakeToken.resetPasswordTokenOne.token })
        .send(sendPassword)
        .expect(httpStatus.OK);

      const checkPassword = await prisma.user.findUnique({
        where: { id: fakeUser.userOne.id }
      });

      const getToken = await prisma.token.findFirst({
        where: { userId: fakeToken.resetPasswordTokenOne.userId }
      });

      if (checkPassword?.password) {
        const compare = await bcrypt.compare('newPassword11#@', checkPassword.password);

        expect(compare).toBeTruthy();
      }

      expect(getToken).toBeNull();
    });

    test('should return 401 error if token is not valid', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken({ ...fakeToken.resetPasswordTokenOne, blacklisted: true});

      let sendPassword = { newPassword: 'newPassword11#@' };

     await request(app)
        .post('/v1/auth/reset-password')
        .query({ tokens: fakeToken.resetPasswordTokenOne.token })
        .send(sendPassword)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 if user id is not found', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken({...fakeToken.resetPasswordTokenOne, userId: fakeUser.userOne.id});

      let sendPassword = { newPassword: 'newPassword11#@' };

     await request(app)
        .post('/v1/auth/reset-password')
        .query({ tokens: fakeToken.resetPasswordTokenOne.token })
        .send(sendPassword)

        const user = await prisma.user.findUnique({
          where: {id: fakeUser.userOne.id}
        })

        expect(user).toBeDefined();
    });

    test('should retrun 401 error if token refresh is exists', async () => {
      await fakeUser.insertUsers(fakeUser.userOne);
      await fakeToken.insertToken(fakeToken.refreshTokenOne);

      let sendPassword = { newPassword: 'newPassword11#@' };

      await request(app)
          .post('/v1/auth/reset-password')
          .query({ tokens: fakeToken.resetPasswordTokenOne.token })
          .send(sendPassword)
          .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
