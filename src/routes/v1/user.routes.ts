import express, { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import userControllers from '../../controllers/user.controller.js';
import userValidation from '../../validations/user.validation.js';

const router: Router = express.Router();

router
  .route('/:id')
  .patch(auth, validate(userValidation.updatUserById), userControllers.updateUserById)
  .delete(auth, validate(userValidation.deleteUserById), userControllers.deleteUserById);

export default {
  router
};
