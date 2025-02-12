import express, { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import taskControllers from '../../controllers/task.controller.js';
import taskValidation from '../../validations/task.validation.js';

const router: Router = express.Router();

router.get(
  '/completed-task/:userId',
  auth,
  validate(taskValidation.getTasksByUserId),
  taskControllers.getCompletedTask
);
router.get(
  '/uncompleted-task/:userId',
  auth,
  validate(taskValidation.getTasksByUserId),
  taskControllers.getUncompletedTask
);
router.get(
  '/important-task/:userId',
  auth,
  validate(taskValidation.getTasksByUserId),
  taskControllers.getImportantTask
);

router.route('/:userId').get(auth, validate(taskValidation.getTasksByUserId), taskControllers.getTasksByUserId);
router.route('/:userId').post(auth, validate(taskValidation.createTask), taskControllers.createTask);
router.delete('/deletedAll/:userId', auth, validate(taskValidation.deleteAllTask), taskControllers.deleteAllTask);

router
  .route('/:taskId')
  .get(auth, validate(taskValidation.getTaskById), taskControllers.getTaskById)
  .patch(auth, validate(taskValidation.updateTaskById), taskControllers.updateTaskById)
  .delete(auth, validate(taskValidation.deleteTaskById), taskControllers.deleteTaskById);
router.route('/').get(auth, validate(taskValidation.getTasks), taskControllers.getTask);

export default {
  router
};
