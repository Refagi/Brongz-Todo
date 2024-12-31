import { Request, Response, NextFunction } from 'express';
import { z, ZodObject, ZodSchema } from 'zod';
import httpStatus from 'http-status';
import pick from '../utils/pick.js';
import { ApiError } from '../utils/ApiError.js';

type Schema = {
  params?: ZodObject<any>;
  query?: ZodObject<any>;
  body?: ZodObject<any>;
};

const validate = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema) as (keyof Request)[]);

    try {
      const value = (Object.keys(validSchema) as (keyof Schema)[]).reduce(
        (acc, key) => {
          if (validSchema[key]) {
            acc[key] = validSchema[key]?.parse(object[key]);
          }
          return acc;
        },
        {} as Record<string, any>
      );
      if (value.query) {
        Object.defineProperty(req, 'query', {
          value: value.query,
          writable: true,
          configurable: true
        });
      }
      Object.assign(req, value);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((err) => err.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }
      return next(error); // Pass on unexpected errors
    }
  };
};

export default validate;
