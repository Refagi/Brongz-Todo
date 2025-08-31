import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync.js';
import userServices from '../services/user.service.js';
import { Response, Request, NextFunction } from 'express';
import { AuthRequest } from '../models/request.model.js';
import moment from 'moment';

const updateUserById = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userServices.updateUserById(req.params.id, req.body);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update User is successfully',
    data: user
  });
});

const deleteUserById = catchAsync(async (req: AuthRequest, res: Response) => {
  await userServices.deleteUserById(req.params.id);
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete user is successfully',
    data: null
  });
});

export default {
  updateUserById,
  deleteUserById
};
