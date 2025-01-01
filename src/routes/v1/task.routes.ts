import express, { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import taskControllers from '../../controllers/task.controller.js';
import taskValidation from '../../validations/task.validation.js';

const router: Router = express.Router();

router.patch(
  '/completed-task/:taskId',
  auth,
  validate(taskValidation.updateCompletedTask),
  taskControllers.updateCompletedTask
);
router.patch(
  '/favorited-task/:taskId',
  auth,
  validate(taskValidation.updateFavoritedTask),
  taskControllers.updateFavoritedTask
);
router.route('/:userId').post(auth, validate(taskValidation.createTask), taskControllers.createTask);
router
  .route('/:taskId')
  .get(auth, validate(taskValidation.getTaskById), taskControllers.getTaskById)
  .patch(auth, validate(taskValidation.updateTaskById), taskControllers.updateTaskById)
  .delete(auth, validate(taskValidation.deleteTaskById), taskControllers.deleteTaskById);
router.route('/').get(auth, validate(taskValidation.getTasks), taskControllers.getTask);

export default {
  router
};
