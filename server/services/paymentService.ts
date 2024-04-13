import { Op } from 'sequelize';
import { Payment, PaymentPlan } from '../models';
import sequelizeConnection from '../config/sequelizeConnection';

interface PaymentPlanAttributes {
  fee: number;
  effectiveSince: {
    month: number;
    year: number;
  };
}

interface PaymentAttributes {
  playerId: number;
  amount: number;
}

export const createPaymentPlan = async (paymentPlan: PaymentPlanAttributes) => {
  return await PaymentPlan.create({ ...paymentPlan });
};

export const updatePaymentPlan = async (
  id: number,
  paymentPlan: PaymentPlanAttributes
) => {
  return await PaymentPlan.update(paymentPlan, { where: { id } });
};

export const removePaymentPlan = async (id: number) => {
  return await PaymentPlan.destroy({ where: { id } });
};

export const createPayment = async (payment: PaymentAttributes) => {
  return await Payment.create({ ...payment });
};

export const updatePayment = async (id: number, payment: PaymentAttributes) => {
  return await Payment.update(payment, { where: { id } });
};

export const removePayment = async (id: number) => {
  return await Payment.destroy({ where: { id } });
};

export const projectedAmount = async (date: {
  month: number;
  year: number;
}) => {
  const consideringDate = new Date(date.year, date.month);

  const paymentPlan = await PaymentPlan.findOne({
    where: {
      [Op.and]: [
        sequelizeConnection.where(
          sequelizeConnection.fn(
            'DATE',
            sequelizeConnection.fn(
              'CONCAT',
              sequelizeConnection.col('effectiveYear'),
              '-',
              sequelizeConnection.literal('1 + effectiveMonth'),
              '-01'
            )
          ),
          '<=',
          consideringDate
        ),
      ],
    },
    order: [
      ['effectiveYear', 'DESC'],
      ['effectiveMonth', 'DESC'],
    ],
  });
};
