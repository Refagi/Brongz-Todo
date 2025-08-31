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
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { limiter } from '../src/middleware/rate-limit.js';

const app: Express = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// app.use(
//   helmet({
//     frameguard: { action: 'deny' },
//     referrerPolicy: { policy: 'no-referrer' }
//   })
// );

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'http://localhost:5500',
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com',
          'https://unpkg.com'
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
        // imgSrc: ["'self'", 'data:'], // Izinkan gambar dari domain sendiri dan data URI
        // connectSrc: ["'self'", 'https://your-api-domain.com'],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  })
);

app.use(xss());

app.use(
  cors({
    origin: config.FE,
    credentials: true, // Izinkan cookies dikirim dari frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-type', 'Authorization']
    // exposedHeaders: ['Set-Cookie']
  })
);

// aktifin parsing json
app.use(express.json());
// aktifin urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// gzip compression
app.use(compression());

const publicPath = path.resolve(__dirname, '../../public');
app.use(express.static(publicPath));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', limiter);
}

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
