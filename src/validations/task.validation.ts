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
    task: z.string().min(5, { message: 'Task is required must contain at least 5 characters' })
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

const getTasks = {
  query: z.object({
    pages: z.preprocess((val) => Number(val), z.number().optional()),
    sizes: z.preprocess((val) => Number(val), z.number().optional()),
    titles: z.string().optional(),
    completes: z.preprocess((val) => val === 'true', z.boolean().optional()),
    favorites: z.preprocess((val) => val === 'true', z.boolean().optional())
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
    isCompletd: z.boolean().optional(),
    isFavorited: z.boolean().optional()
  })
};

const updateCompletedTask = {
  params: z.object({
    taskId: z
      .string()
      .regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
        message: '"taskId" must be a valid UUID'
      })
  }),

  body: z.object({
    isCompleted: z.boolean()
  })
};

const updateFavoritedTask = {
  params: z.object({
    taskId: z
      .string()
      .regex(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi, {
        message: '"taskId" must be a valid UUID'
      })
  }),

  body: z.object({
    isFavorited: z.boolean()
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
  getTasks,
  updateTaskById,
  updateCompletedTask,
  updateFavoritedTask,
  deleteTaskById
};
