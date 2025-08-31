import { z } from 'zod';

const register = {
  body: z.object({
    username: z.string().min(5, { message: 'Name is required must contain at least 5 characters' }),
    email: z
      .string()
      .email({ message: 'Email must be a valid email address' })
      .refine((email) => email.endsWith('@gmail.com'), { message: 'Email must end with @gmail.com' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
        {
          message: 'Password must contain at least 1 letter, 1 number, and 1 special character'
        }
      )
  })
};

const login = {
  body: z.object({
    email: z
      .string()
      .email({ message: 'Email must be a valid email address' })
      .refine((email) => email.endsWith('@gmail.com'), { message: 'Email must end with @gmail.com' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
        {
          message: 'Password must contain at least 1 letter, 1 number, and 1 special character'
        }
      )
  })
};

const logout = {
  body: z.object({
    tokens: z.string().min(1, { message: 'refresh token must exist!' })
  })
};

const refreshToken = {
  body: z.object({
    tokens: z.string().min(1, { message: 'refresh token must exist!' })
  })
};

const forgotPassword = {
  body: z.object({
    email: z
      .string()
      .email({ message: 'Email must be a valid email address' })
      .refine((email) => email.endsWith('@gmail.com'), { message: 'Email must end with @gmail.com' })
  })
};

const resetPassword = {
  query: z.object({
    tokens: z.string().min(1, { message: 'refresh token must exist!' })
  }),
  body: z.object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
        {
          message: 'Password must contain at least 1 letter, 1 number, and 1 special character'
        }
      )
  })
};

const verifyEmail = {
  cookies: z.object({
    verifyEmail: z.string().min(1, { message: 'verify token must exist!' })
  })
};

export default {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail
};
