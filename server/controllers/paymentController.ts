import { Request, Response } from 'express';
import {
  createPaymentPlan,
  getNearestFuturePlan,
  getOngoingPlan,
  getPayments,
  getDuePayments,
  removePayment,
  removePaymentPlan,
  updatePayment,
  updatePaymentPlan,
  getProjectionsAndDues,
  createBulkPayments,
} from '../services/paymentService';
import { StatusCodes } from 'http-status-codes';

const pay = async (req: Request, res: Response) => {
  const { details } = req.body;
  const payments = details.map((detail: any) => ({
    playerId: detail.id,
    amount: detail.values.amount,
  }));

  const createdPayments = await createBulkPayments(payments);

  return res.status(StatusCodes.CREATED).json({
    message: 'Payment created successfully.',
    payment: createdPayments,
  });
};

const updatePay = async (req: Request, res: Response) => {
  const paymentId: string = req.params.id;
  const { id, amount } = req.body;

  const updatedPayment = await updatePayment(paymentId, {
    playerId: id,
    amount,
  });

  return res.status(StatusCodes.OK).json({
    message: 'Payment updated successfully.',
  });
};

const removePay = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  await removePayment(id);

  return res.status(StatusCodes.NO_CONTENT).json({
    message: 'Payment removed successfully.',
  });
};

const createPlan = async (req: Request, res: Response) => {
  const {
    fee,
    effectiveFrom,
  }: { fee: number; effectiveFrom: { month: number; year: number } } = req.body;

  const createdPaymentPlan = await createPaymentPlan({
    fee,
    effectiveFrom,
  });

  return res.status(StatusCodes.CREATED).json({
    message: 'Payment plan created successfully.',
    plan: createdPaymentPlan,
  });
};

const updatePlan = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { fee, effectiveFrom } = req.body;

  const updatedPlan = await updatePaymentPlan(id, {
    fee,
    effectiveFrom,
  });

  return res.status(StatusCodes.OK).json({
    message: 'Payment plan updated successfully.',
  });
};

const removePlan = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  await removePaymentPlan(id);

  return res.status(StatusCodes.NO_CONTENT).json({
    message: 'Payment plan removed successfully.',
  });
};

const getPaymentPlans = async (req: Request, res: Response) => {
  const month: number = Number(req.query.month);
  const year: number = Number(req.query.year);
  Number;

  const onGoingPlan = await getOngoingPlan({ month, year });
  const futurePlan = await getNearestFuturePlan({ month, year });

  return res.status(StatusCodes.OK).json({
    onGoingPlan,
    futurePlan,
  });
};

const getProjections = async (req: Request, res: Response) => {
  const month: number = Number(req.query.month);
  const year: number = Number(req.query.year);
  Number;

  const projections = await getProjectionsAndDues({ month, year });
  return res.status(StatusCodes.OK).json({
    ...projections,
  });
};

const getDues = async (req: Request, res: Response) => {
  const month: number = Number(req.query.month);
  const year: number = Number(req.query.year);
  Number;

  const duePayments = await getDuePayments({ month, year });

  return res.status(StatusCodes.OK).json({
    ...duePayments,
  });
};

const getPreviousPayments = async (req: Request, res: Response) => {
  const payments = await getPayments();

  return res.status(StatusCodes.OK).json({
    payments,
  });
};

export default {
  pay,
  updatePay,
  removePay,
  createPlan,
  updatePlan,
  removePlan,
  getPaymentPlans,
  getDues,
  getProjections,
  getPreviousPayments,
};
