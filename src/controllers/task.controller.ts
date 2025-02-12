import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync.js';
import taskServices from '../services/task.service.js';
import { Response, Request, NextFunction } from 'express';
import { AuthRequest } from '../models/request.model.js';
import { ApiError } from '../utils/ApiError.js';
import moment from 'moment';

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

const getImportantTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const getTaskUser = await taskServices.getImportantTask(req.params.userId);

  if (!getTaskUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tasks important not found!');
  }

  const formattedTasks = getTaskUser.map((task) => {
    const dueDate = moment(task.dueDate).format('YYYY-MM-DD'); // Format langsung jadi string
    return {
      ...task,
      dueDate
    };
  });

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Task is successfully',
    data: formattedTasks
  });
});

const getCompletedTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const getTaskUser = await taskServices.getCompletedTask(req.params.userId);

  if (!getTaskUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tasks completed not found!');
  }

  const formattedTasks = getTaskUser.map((task) => {
    const dueDate = moment(task.dueDate).format('YYYY-MM-DD'); // Format langsung jadi string
    return {
      ...task,
      dueDate
    };
  });

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Task is successfully',
    data: formattedTasks
  });
});

const getUncompletedTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const getTaskUser = await taskServices.getUncompletedTask(req.params.userId);

  if (!getTaskUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tasks uncompleted not found!');
  }

  const formattedTasks = getTaskUser.map((task) => {
    const dueDate = moment(task.dueDate).format('YYYY-MM-DD'); // Format langsung jadi string
    return {
      ...task,
      dueDate
    };
  });

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Task is successfully',
    data: formattedTasks
  });
});

const getTasksByUserId = catchAsync(async (req: AuthRequest, res: Response) => {
  const getTaskUser = await taskServices.getTasksByUserId(req.params.userId);

  if (!getTaskUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tasks user not found!');
  }

  const formattedTasks = getTaskUser.map((task) => {
    const dueDate = moment(task.dueDate).format('YYYY-MM-DD'); // Format langsung jadi string
    return {
      ...task,
      dueDate
    };
  });

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Task is successfully',
    data: formattedTasks
  });
});

const getTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const option = {
    pages: req.query.pages ? Number(req.query.pages) : 1,
    sizes: req.query.sizes ? Number(req.query.sizes) : 2,
    title: typeof req.query.title === 'string' ? req.query.title : '',
    isCompleted: req.query.isCompleted === 'true' ? true : req.query.isCompleted === 'false' ? false : undefined, // Convert to boolean if 'true'/'false',
    isImportant: req.query.isImportant === 'true' ? true : req.query.isImportant === 'false' ? false : undefined // Convert to boolean if 'true'/'false'
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

  const dueDate = moment(tasks.dueDate).format('YYYY-MM-DD'); // Format langsung jadi string

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Task is successfully',
    data: { ...tasks, dueDate }
  });
});

const deleteAllTask = catchAsync(async (req: AuthRequest, res: Response) => {
  await taskServices.deleteAllTask(req.params.taskId);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete all Task is successfully',
    data: null
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
  getImportantTask,
  getCompletedTask,
  getUncompletedTask,
  getTasksByUserId,
  getTask,
  updateTaskById,
  deleteAllTask,
  deleteTaskById
};
