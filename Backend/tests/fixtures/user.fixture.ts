import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import prisma from '../../prisma/client.js';
import { faker } from '@faker-js/faker';

const passwordOne = 'kiplii#$11';
const passwordTwo = 'kiboyy#$28'

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  age: number;
  isEmailVerified: boolean
}

const userOne: User = {
  id: 'ff41fded-803d-4de1-9698-1624801d3b74',
  username: 'kiplii',
  email: 'kiplii@gmail.com',
  password: bcrypt.hashSync(passwordOne, 8),
  age: 20,
  isEmailVerified : false
}

const userTwo: User = {
  id: 'ff41fded-803d-4de1-8668-1624801d3b74',
  username: 'kiboyy',
  email: 'kiboyy@gmail.com',
  password: bcrypt.hashSync(passwordTwo, 8),
  age: 20,
  isEmailVerified : false
}

// const insertUsers = async (users: User[]): Promise<void> => {
//   users = users.map((user) => ({...user}));
//   await prisma.user.createMany({
//     data: users,
//     skipDuplicates: true
//   })
// }

const insertUsers = async (users: User): Promise<void> => {
  await prisma.user.create({
    data: users,
  })
}

export default {
  userOne,
  userTwo,
  insertUsers
}

