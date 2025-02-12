import { z } from 'zod';

const createTask = {
  params: z.object({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
        message: '"taskId" must be a valid UUID'
      })
  }),

  body: z.object({
    title: z.string(),
    task: z.string().min(5, { message: 'Task is required must contain at least 5 characters' }),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in the format YYYY-MM-DD'
    }),
    isCompleted: z.preprocess((val) => val === true || val === 'true', z.boolean().optional()),
    isImportant: z.preprocess((val) => val === true || val === 'true', z.boolean().optional())
  })
};

const getTaskById = {
  params: z.object({
    taskId: z
      .string()
      .regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
        message: '"taskId" must be a valid UUID'
      })
  })
};

const getTasksByUserId = {
  params: z.object({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
        message: '"userId" must be a valid UUID'
      })
  })
};

const getTasks = {
  query: z.object({
    pages: z.preprocess((val) => (val ? Number(val) : 1), z.number().optional()),
    sizes: z.preprocess((val) => (val ? Number(val) : 2), z.number().optional()),
    title: z.string().optional(),
    isCompleted: z.preprocess((val) => val === 'true', z.boolean().optional()),
    isImportant: z.preprocess((val) => val === 'true', z.boolean().optional())
  })
};

const updateTaskById = {
  params: z.object({
    taskId: z
      .string()
      .regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
        message: '"taskId" must be a valid UUID'
      })
  }),

  body: z.object({
    title: z.string().optional(),
    task: z.string().min(5, { message: 'Task is required must contain at least 5 characters' }).optional(),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in the format YYYY-MM-DD'
    }),
    isCompleted: z.preprocess((val) => val === true || val === 'true', z.boolean().optional()),
    isImportant: z.preprocess((val) => val === true || val === 'true', z.boolean().optional())
  })
};

const deleteAllTask = {
  params: z.object({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
        message: '"userId" must be a valid UUID'
      })
  })
};

export const deleteTaskById = {
  params: z.object({
    taskId: z
      .string()
      .regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
        message: '"taskId" must be a valid UUID'
      })
  })
};

export default {
  createTask,
  getTaskById,
  getTasksByUserId,
  getTasks,
  updateTaskById,
  deleteAllTask,
  deleteTaskById
};
