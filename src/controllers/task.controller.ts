import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync.js';
import taskServices from '../services/task.service.js';
import { Response, Request, NextFunction } from 'express';
import { AuthRequest } from '../models/request.model.js';
import { ApiError } from '../utils/ApiError.js';

const createTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.createTask(req.params.userId, req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Task is successfully',
    data: task
  });
});

const getTaskById = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.getTaskById(req.params.taskId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found!');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Task is successfully',
    data: task
  });
});

const getTask = catchAsync(async (req: AuthRequest, res: Response) => {
  console.log('pages', req.query.pages);
  console.log('sizes', req.query.sizes);
  const option = {
    pages: Number(req.query.pages) ?? 1,
    sizes: Number(req.query.sizes) ?? 6,
    titles: typeof req.query.titles === 'string' ? req.query.titles : '',
    completes: req.query.completes === 'true' ? true : req.query.completes === 'false' ? false : undefined, // Convert to boolean if 'true'/'false',
    favorites: req.query.favorites === 'true' ? true : req.query.favorites === 'false' ? false : undefined // Convert to boolean if 'true'/'false'
  };

  const tasks = await taskServices.getTasks(option);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Tasks is successfully',
    data: tasks
  });
});

const updateTaskById = catchAsync(async (req: AuthRequest, res: Response) => {
  const tasks = await taskServices.updateTaskById(req.params.taskId, req.body);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Task is successfully',
    data: tasks
  });
});

const updateCompletedTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const updateCompleted = await taskServices.updateCompletedTask(req.params.taskId, req.body.isCompleted);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update completed task is successfully',
    data: updateCompleted
  });
});

const updateFavoritedTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const updateFavorited = await taskServices.updateFavoritedTask(req.params.taskId, req.body.isFavorited);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Favorited task is successfully',
    data: updateFavorited
  });
});

const deleteTaskById = catchAsync(async (req: AuthRequest, res: Response) => {
  await taskServices.deleteTaskById(req.params.taskId);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Task is successfully',
    data: null
  });
});

export default {
  createTask,
  getTaskById,
  getTask,
  updateTaskById,
  updateCompletedTask,
  updateFavoritedTask,
  deleteTaskById
};
