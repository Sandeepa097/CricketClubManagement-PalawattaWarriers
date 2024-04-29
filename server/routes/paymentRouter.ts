import { Router } from 'express';
import { validatePermissions, validateRequest } from './validator';
import { UserTypes } from '../constants/UserTypes';
import { body, param, query } from 'express-validator';
import { findPlayer } from '../services/playerService';
import paymentController from '../controllers/paymentController';
import { findPayment, findPaymentPlan } from '../services/paymentService';

const paymentRouter = Router();

paymentRouter.post(
  '/',
  validatePermissions([UserTypes.ADMIN, UserTypes.TREASURER]),
  validateRequest([
    body('details').isArray().withMessage('Payment details must be an array.'),
    body('details.*.id')
      .toInt()
      .custom(async (value) => {
        if (!value) return true;
        const player = await findPlayer(value);
        if (!player) throw Error('Player id is invalid.');
        return true;
      }),
    body('details.*.values.amount')
      .notEmpty()
      .withMessage('Amount is required.')
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Amount must be at least one rupee.'),
  ]),
  paymentController.pay
);

paymentRouter.get(
  '/',
  validateRequest([
    query('limit')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Limit must be an positive integer.'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be an positive integer.'),
  ]),
  paymentController.getPreviousPayments
);

paymentRouter.get(
  '/dues',
  validateRequest([
    query('month')
      .notEmpty()
      .withMessage('Month is required.')
      .isInt({ min: 0, max: 11 })
      .withMessage('Month must be an integer between 0 and 11.'),
    query('year')
      .notEmpty()
      .withMessage('Year is required.')
      .isInt({ min: 1 })
      .withMessage('Year must be a positive integer.'),
  ]),
  paymentController.getDues
);

paymentRouter.get(
  '/projections',
  validateRequest([
    query('month')
      .notEmpty()
      .withMessage('Month is required.')
      .isInt({ min: 0, max: 11 })
      .withMessage('Month must be an integer between 0 and 11.'),
    query('year')
      .notEmpty()
      .withMessage('Year is required.')
      .isInt({ min: 1 })
      .withMessage('Year must be a positive integer.'),
  ]),
  paymentController.getProjections
);

paymentRouter.post(
  '/plans',
  validatePermissions([UserTypes.ADMIN, UserTypes.TREASURER]),
  validateRequest([
    body('fee')
      .notEmpty()
      .withMessage('Fee is required.')
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Fee must be at least one rupee.'),
    body('effectiveFrom.month')
      .notEmpty()
      .withMessage('Effective month is required.')
      .isInt({ min: 0, max: 11 })
      .toInt()
      .withMessage('Effective month must be an integer between 0 and 11.'),
    body('effectiveFrom.year')
      .notEmpty()
      .withMessage('Effective year is required.')
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Effective year must be positive integer.'),
  ]),
  paymentController.createPlan
);

paymentRouter.put(
  '/plans/:id',
  validatePermissions([UserTypes.ADMIN, UserTypes.TREASURER]),
  validateRequest([
    param('id')
      .exists()
      .toInt()
      .custom(async (value) => {
        const plan = await findPaymentPlan(value);
        if (!plan) throw Error('Payment plan id is invalid.');
        return true;
      }),
    body('fee')
      .notEmpty()
      .withMessage('Fee is required.')
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Fee must be at least one rupee.'),
    body('effectiveFrom.month')
      .notEmpty()
      .withMessage('Effective month is required.')
      .isInt({ min: 0, max: 11 })
      .toInt()
      .withMessage('Effective month must be an integer between 0 and 11.'),
    body('effectiveFrom.year')
      .notEmpty()
      .withMessage('Effective year is required.')
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Effective year must be positive integer.'),
  ]),
  paymentController.updatePlan
);

paymentRouter.delete(
  '/plans/:id',
  validatePermissions([UserTypes.ADMIN, UserTypes.TREASURER]),
  validateRequest([
    param('id')
      .exists()
      .toInt()
      .custom(async (value) => {
        const plan = await findPaymentPlan(value);
        if (!plan) throw Error('Payment plan id is invalid.');
        return true;
      }),
  ]),
  paymentController.removePlan
);

paymentRouter.get(
  '/plans',
  validateRequest([
    query('month')
      .notEmpty()
      .withMessage('Month is required.')
      .isInt({ min: 0, max: 11 })
      .withMessage('Month must be an integer between 0 and 11.'),
    query('year')
      .notEmpty()
      .withMessage('Year is required.')
      .isInt({ min: 1 })
      .withMessage('Year must be a positive integer.'),
  ]),
  paymentController.getPaymentPlans
);

paymentRouter.put(
  '/:id',
  validatePermissions([UserTypes.ADMIN, UserTypes.TREASURER]),
  validateRequest([
    param('id')
      .exists()
      .toInt()
      .custom(async (value) => {
        const payment = await findPayment(value);
        if (!payment) throw Error('Payment id is invalid.');
        return true;
      }),
    body('id')
      .toInt()
      .custom(async (value) => {
        if (!value) return true;
        const player = await findPlayer(value);
        if (!player) throw Error('Player id is invalid.');
        return true;
      }),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required.')
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Amount must be at least one rupee.'),
  ]),
  paymentController.updatePay
);

paymentRouter.delete(
  '/:id',
  validatePermissions([UserTypes.ADMIN, UserTypes.TREASURER]),
  validateRequest([
    param('id')
      .exists()
      .toInt()
      .custom(async (value) => {
        const payment = await findPayment(value);
        if (!payment) throw Error('Payment id is invalid.');
        return true;
      }),
  ]),
  paymentController.removePay
);

export default paymentRouter;
