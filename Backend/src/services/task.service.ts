import httpStatus from 'http-status';
import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/ApiError.js';
import { ResuestCreateTask, RequestGetTasks, RequestUpdateTask, RequestCompletedTask } from '../models/task.model.js';

const createTask = async (userId: string, taskBody: ResuestCreateTask) => {
  const tasks = await prisma.task.create({
    data: {
      title: taskBody.title,
      task: taskBody.task,
      dueDate: new Date(taskBody.dueDate),
      isCompleted: taskBody.isCompleted ?? false,
      isImportant: taskBody.isImportant ?? false,
      userId: userId
    }
  });
  return tasks;
};

const getTaskById = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });
  return task;
};

const getImportantTask = async (userId: string) => {
  const task = await prisma.task.findMany({
    where: { userId: userId, isImportant: true }
  });
  return task;
};

const getCompletedTask = async (userId: string) => {
  const task = await prisma.task.findMany({
    where: { userId: userId, isCompleted: true }
  });
  return task;
};

const getUncompletedTask = async (userId: string) => {
  const task = await prisma.task.findMany({
    where: { userId: userId, isCompleted: false }
  });
  return task;
};

const getTasksByUserId = async (userId: string) => {
  const task = await prisma.task.findMany({
    where: { userId: userId }
  });
  return task;
};

const getTasks = async (option: RequestGetTasks) => {
  let { pages = 1, sizes = 2, title = '', isCompleted, isImportant } = option;
  const skip = (pages - 1) * sizes;
  const whereCondition = {
    AND: [
      title
        ? {
            title: {
              contains: title
            }
          }
        : {},
      isCompleted !== undefined ? { isCompleted } : {},
      isImportant !== undefined ? { isImportant } : {}
    ].filter((condition) => Object.keys(condition).length > 0)
  };

  const tasks = await prisma.task.findMany({
    skip: skip,
    take: sizes,
    where: whereCondition.AND.length ? whereCondition : {},
    orderBy: { title: 'asc' }
  });
  const formattedTasks = tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  }));

  let totalData: number = await prisma.task.count({ where: whereCondition.AND.length ? whereCondition : {} });
  let totalPage: number = Math.ceil(totalData / sizes);

  return { totalData, totalPage, tasks: formattedTasks, pages };
};

const updateTaskById = async (id: string, taskBody: RequestUpdateTask) => {
  const getTask = await getTaskById(id);

  if (!getTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found!');
  }

  const updateTask = await prisma.task.update({
    where: { id },
    data: {
      title: taskBody.title,
      task: taskBody.task,
      dueDate: new Date(taskBody.dueDate),
      isCompleted: taskBody.isCompleted ?? false,
      isImportant: taskBody.isImportant ?? false
    }
  });

  return updateTask;
};

const deleteAllTask = async (userId: string) => {
  const deleteTask = await prisma.task.deleteMany({
    where: { userId: userId }
  });
  return deleteTask;
};

const deleteTaskById = async (id: string) => {
  const getTask = await getTaskById(id);

  if (!getTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not founf!');
  }

  const deleteTask = await prisma.task.delete({
    where: { id }
  });

  return deleteTask;
};

export default {
  createTask,
  getTaskById,
  getImportantTask,
  getCompletedTask,
  getUncompletedTask,
  getTasksByUserId,
  getTasks,
  updateTaskById,
  deleteAllTask,
  deleteTaskById
};
