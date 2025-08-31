import express, { Router } from 'express';
import userRoute from './user.routes.js';
import authRoute from './auth.routes.js';
import taskRoute from './task.routes.js';
import config from '../../config/config.js';

const router = express.Router();

interface Route {
  path: string;
  route: Router;
}

const defaultRoutes: Route[] = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/tasks',
    route: taskRoute
  }
];

// const devRoutes: Route[] = [
//   // Routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute
//   }
// ];

// Register default routes
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   // Register development-only routes
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router;
