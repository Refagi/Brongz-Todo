import httpStatus from 'http-status';
import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import { RequestCreateUser, ResquestUpdateUser } from '../models/user.model.js';
import { User } from '@prisma/client';

const createUser = async (userBody: RequestCreateUser) => {
  userBody.password = bcrypt.hashSync(userBody.password, 8);

  return prisma.user.create({
    data: {
      username: userBody.username,
      email: userBody.email,
      password: userBody.password,
      age: userBody.age
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      age: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

const getUserById = async (userId: string) => {
  const user: User | null = await prisma.user.findUnique({
    where: { id: userId }
  });
  return user;
};

const getUserByEmail = async (email: string) => {
  const user: User | null = await prisma.user.findUnique({
    where: { email }
  });

  return user;
};

const updateUserById = async (userId: string, updateBody: ResquestUpdateUser) => {
  const getUser = await getUserById(userId);

  if (!getUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (updateBody.email) {
    const isEmailTaken = await getUserByEmail(updateBody.email);
    if (isEmailTaken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken!');
    }
  }

  if (updateBody.password) {
    const matchPassword = await bcrypt.compare(updateBody.password, getUser.password);
    if (matchPassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password is not correct!');
    }
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }

  const updateUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: updateBody
  });
  return updateUser;
};

const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const deleteUser = await prisma.user.delete({
    where: { id: userId }
  });
  return deleteUser;
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById
};
