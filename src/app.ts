import type { Express } from 'express';
import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { jwtStrategy } from './config/passport.js';
import cors from 'cors';
import morgan from './config/morgan.js';
import httpStatus from 'http-status';
import config from './config/config.js';
import routes from './routes/v1/index.routes.js';
import { ApiError } from './utils/ApiError.js';
import { errorConverter, errorHandler } from './middleware/error.js';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import compression from 'compression';

const app: Express = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(
  helmet({
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'no-referrer' }
  })
);

// aktifin parsing json
app.use(express.json());

// aktifin urlencoded
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

app.use(xss());

// enable cors
app.use(
  '/v1/*',
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-type', 'Authorization']
  })
);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
