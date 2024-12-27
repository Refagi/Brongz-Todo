import express from 'express';
import { auth } from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import authValidation from '../../validations/auth.validation.js';
import controllers from '../../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validate(authValidation.register), controllers.register);
router.post('/login', validate(authValidation.login), controllers.login);
router.post('/logout', validate(authValidation.logout), controllers.logout);
router.post('/refresh-token', validate(authValidation.refreshToken), controllers.refreshToken);
router.post('/forgot-password', validate(authValidation.forgotPassword), controllers.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), controllers.resetPassword);
router.post('/send-verification-email', controllers.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), controllers.verifyEmail);

export default {
  router
};
