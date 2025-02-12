import httpStatus from 'http-status';
import config from '../config/config.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction): void => {
  let error = err;
  if (!(error instanceof ApiError)) {
    // If error is from Axios or HTTP request
    if (error.response) {
      const message = error.response.data?.message || error.response.data;
      const statusCode = error.response.status;

      logger.info('handleApiError');
      error = new ApiError(statusCode, message, false, err.stack);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // Handling Prisma Error
      logger.info('handlePrismaError');
      error = handlePrismaError(err);
    } else {
      // Handling global errors
      const statusCode = error.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message ?? httpStatus[statusCode as keyof typeof httpStatus];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }
  next(error);
};

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): ApiError => {
  switch (err.code) {
    case 'P2002':
      // Handling duplicate key errors
      return new ApiError(httpStatus.BAD_REQUEST, `Duplicate field value: ${err.meta?.target}`, false, err.stack);
    case 'P2014':
      // Handling invalid ID errors
      return new ApiError(httpStatus.BAD_REQUEST, `Invalid ID: ${err.meta?.target}`, false, err.stack);
    case 'P2003':
      // Handling invalid data errors
      return new ApiError(httpStatus.BAD_REQUEST, `Invalid input data: ${err.meta?.target}`, false, err.stack);
    default:
      // Handling all other errors
      return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Something went wrong: ${err.message}`, false, err.stack);
  }
};

export const errorHandler = (err: ApiError, _req: Request, res: Response, next: NextFunction): void => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Something went wrong, please try again later.';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export default {
  errorHandler,
  errorConverter
};
