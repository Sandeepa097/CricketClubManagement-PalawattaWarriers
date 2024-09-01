import { Request, Response } from 'express';
import {
  createPaymentPlan,
  getNearestFuturePlans,
  getOngoingPlans,
  getPayments,
  getDuePayments,
  removePayment,
  removePaymentPlan,
  updatePayment,
  updatePaymentPlan,
  getProjectionsAndDues,
  createBulkPayments,
  getPaymentsCount,
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
    playerId,
  }: {
    fee: number;
    effectiveFrom: { month: number; year: number };
    playerId: number;
  } = req.body;

  const createdPaymentPlan = await createPaymentPlan({
    fee,
    effectiveFrom,
    playerId,
  });

  return res.status(StatusCodes.CREATED).json({
    message: 'Payment plan created successfully.',
    plan: createdPaymentPlan,
  });
};

const updatePlan = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { fee, effectiveFrom, playerId } = req.body;

  const updatedPlan = await updatePaymentPlan(id, {
    fee,
    effectiveFrom,
    playerId,
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

const getOngoingPaymentPlans = async (req: Request, res: Response) => {
  const month: number = Number(req.query.month);
  const year: number = Number(req.query.year);
  Number;

  const ongoingPlans = await getOngoingPlans({ month, year });

  return res.status(StatusCodes.OK).json({
    ongoingPlans,
  });
};

const getFuturePaymentPlans = async (req: Request, res: Response) => {
  const month: number = Number(req.query.month);
  const year: number = Number(req.query.year);
  Number;

  const futurePlans = await getNearestFuturePlans({ month, year });

  return res.status(StatusCodes.OK).json({
    futurePlans,
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
  const totalCount = await getPaymentsCount();
  const limit: number = Number(req.query.limit || totalCount);
  const offset: number = Number(req.query.offset || 0);
  const payments = await getPayments(offset, limit);

  return res.status(StatusCodes.OK).json({
    payments,
    totalCount,
  });
};

export default {
  pay,
  updatePay,
  removePay,
  createPlan,
  updatePlan,
  removePlan,
  getOngoingPaymentPlans,
  getFuturePaymentPlans,
  getDues,
  getProjections,
  getPreviousPayments,
};
