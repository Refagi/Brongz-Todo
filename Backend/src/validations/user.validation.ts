import { z } from 'zod';

const updatUserById = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
      message: '"id" must be a valid UUID'
    })
  }),

  body: z.object({
    username: z.string().min(5, { message: 'Name is required must contain at least 5 characters' }).optional(),
    email: z.string().email({ message: 'Email must be a valid email address' }).optional(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
        {
          message: 'Password must contain at least 1 letter, 1 number, and 1 special character'
        }
      )
      .optional(),
    age: z.number().positive({ message: 'Age must be a positive number' }).optional()
  })
};

export const deleteUserById = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
      message: '"id" must be a valid UUID'
    })
  })
};

export default {
  updatUserById,
  deleteUserById
};
