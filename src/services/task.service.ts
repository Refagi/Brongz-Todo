import httpStatus from 'http-status';
import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import { ResuestCreateTask, RequestGetTasks, RequestUpdateTask, RequestCompletedTask } from '../models/task.model.js';

const createTask = async (userId: string, taskBody: ResuestCreateTask) => {
  const tasks = await prisma.task.create({
    data: {
      title: taskBody.title,
      task: taskBody.task,
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

const getTasks = async (option: RequestGetTasks) => {
  let { pages, sizes, titles, completes, favorites } = option;
  const skip = (pages - 1) * sizes;

  const task = await prisma.task.findMany({
    skip: skip,
    take: sizes,
    where: {
      OR: [
        {
          title: { contains: titles, mode: 'insensitive' }
        },
        {
          isCompleted: completes
        },
        {
          isFavorited: favorites
        }
      ]
    },
    orderBy: { title: 'asc' }
  });

  let totalData: number = await prisma.task.count();
  let totalPage: number = Math.ceil(totalData / sizes);

  if (totalData >= 10) {
    switch (sizes) {
      case 5:
        totalData -= 5;
        break;
      case 10:
        totalData -= 10;
        break;
      case 15:
        totalData -= 15;
        break;
      case 20:
        totalData -= 20;
        break;
    }
  }

  let firstPage: number = pages - 3 < 1 ? 1 : pages - 3; //untuk number awal mualai di pagination
  let lastPage: number = firstPage + 5 <= totalPage ? firstPage + 5 : pages + (totalPage - pages); // untuk number akhir di pagination

  //untuk hitung (angka awal pagination) jika (angka akhir) kurang dari (page + 4)
  //agar pagination tetap 1 sampai 6 (karena saya menampilkan antara 1 - 6 angka)
  if (lastPage < pages + 2) {
    firstPage -= pages + 2 - totalPage;
  }

  if (totalData <= 5 || totalData <= 10 || totalData <= 15 || totalData <= 20) {
    firstPage = 1;
  }

  return { totalData, totalPage, task, pages, sizes, firstPage, lastPage, titles, completes, favorites };
};

const updateTaskById = async (taskId: string, taskBody: RequestUpdateTask) => {
  const getTask = await getTaskById(taskId);

  if (!getTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found!');
  }

  const updateTask = await prisma.task.update({
    where: { id: taskId },
    data: taskBody
  });

  return updateTask;
};

const updateCompletedTask = async (taskId: string, isCompleted: boolean) => {
  const getTask = await getTaskById(taskId);

  if (!getTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found!');
  }

  const updateCompleted = await prisma.task.update({
    where: { id: taskId },
    data: { isCompleted }
  });

  return updateCompleted;
};

const updateFavoritedTask = async (taskId: string, isFavorited: boolean) => {
  const getTask = await getTaskById(taskId);

  if (!getTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found!');
  }

  const updateFavorited = await prisma.task.update({
    where: { id: taskId },
    data: { isFavorited }
  });

  return updateFavorited;
};

const deleteTaskById = async (taskId: string) => {
  const getTask = await getTaskById(taskId);

  if (!getTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not founf!');
  }

  const deleteTask = await prisma.task.delete({
    where: { id: taskId }
  });

  return deleteTask;
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
