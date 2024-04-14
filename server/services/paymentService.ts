import { Op } from 'sequelize';
import { Payment, PaymentPlan, Player } from '../models';
import sequelizeConnection from '../config/sequelizeConnection';

interface PaymentPlanAttributes {
  fee: number;
  effectiveFrom: {
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
  id: number | string,
  paymentPlan: PaymentPlanAttributes
) => {
  return await PaymentPlan.update(paymentPlan, { where: { id } });
};

export const removePaymentPlan = async (id: number | string) => {
  return await PaymentPlan.destroy({ where: { id } });
};

export const findPaymentPlan = async (id: number | string) => {
  return await PaymentPlan.findByPk(id);
};

export const createPayment = async (payment: PaymentAttributes) => {
  return await Payment.create({ ...payment });
};

export const updatePayment = async (
  id: number | string,
  payment: PaymentAttributes
) => {
  return await Payment.update(payment, { where: { id } });
};

export const removePayment = async (id: number | string) => {
  return await Payment.destroy({ where: { id } });
};

export const findPayment = async (id: number | string) => {
  return await Payment.findByPk(id);
};

export const getPayments = async () => {
  return await Payment.findAll({
    include: {
      model: Player,
      as: 'player',
    },
  });
};

export const getOngoingPlan = async (date: { month: number; year: number }) => {
  const consideringDate = new Date(date.year, date.month, 1);

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

  return paymentPlan;
};

export const getNearestFuturePlan = async (date: {
  year: number;
  month: number;
}) => {
  const consideringDate = new Date(date.year, date.month, 1);

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
          '>',
          consideringDate
        ),
      ],
    },
    order: [
      ['effectiveYear', 'ASC'],
      ['effectiveMonth', 'ASC'],
    ],
  });

  return paymentPlan;
};

export const projectedAndDueAmounts = async (date: {
  month: number;
  year: number;
}) => {
  const consideringDate = new Date(date.year, date.month, 1);
  const effectivePlan = await getOngoingPlan(date);
  const payersOfConsideringDate = await Player.findAll({
    attributes: ['id', 'feesPayingMonth', 'feesPayingYear'],
    where: {
      [Op.and]: [
        sequelizeConnection.where(
          sequelizeConnection.fn(
            'DATE',
            sequelizeConnection.fn(
              'CONCAT',
              sequelizeConnection.col('feesPayingYear'),
              '-',
              sequelizeConnection.literal('1 + feesPayingMonth'),
              '-01'
            )
          ),
          '<=',
          consideringDate
        ),
      ],
    },
  });

  const projected =
    effectivePlan?.dataValues.fee * payersOfConsideringDate.length;

  const duePlayers = [];

  let due = 0;
  for (let i = 0; i < payersOfConsideringDate.length; i++) {
    const mustHavePaid = await calculateSinglePlayerProjectedTotal(
      {
        month: payersOfConsideringDate[i].dataValues.feesPayingMonth,
        year: payersOfConsideringDate[i].dataValues.feesPayingYear,
      },
      date
    );
    const totalPaid = await calculateSinglePlayerTotalPaid(
      payersOfConsideringDate[i].dataValues.id
    );

    const dueAmount = mustHavePaid - totalPaid;
    if (dueAmount > 0) {
      duePlayers.push({
        ...payersOfConsideringDate[i].dataValues,
        due: dueAmount,
      });
    }
    due += dueAmount > 0 ? dueAmount : 0;
  }

  return { projected, due, duePlayers };
};

export const calculateSinglePlayerProjectedTotal = async (
  start: { month: number; year: number },
  end: { month: number; year: number }
) => {
  const startDate = new Date(start.year, start.month, 1);
  const endDate = new Date(end.year, end.month, 1);

  const paymentPlans = await PaymentPlan.findAll({
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
          '>=',
          startDate
        ),
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
          endDate
        ),
      ],
    },
    order: [
      ['effectiveYear', 'ASC'],
      ['effectiveMonth', 'ASC'],
    ],
  });

  let totalFee = 0;
  let previousDate = startDate;
  for (const paymentPlan of paymentPlans) {
    const effectiveDate = new Date(
      paymentPlan.effectiveYear,
      paymentPlan.effectiveMonth,
      1
    );
    const months =
      (effectiveDate.getFullYear() - previousDate.getFullYear()) * 12 +
      effectiveDate.getMonth() -
      previousDate.getMonth();
    totalFee += months * paymentPlan.fee;
    previousDate = effectiveDate;
  }
  const remainingMonths =
    (endDate.getFullYear() - previousDate.getFullYear()) * 12 +
    endDate.getMonth() -
    previousDate.getMonth();
  totalFee += remainingMonths * paymentPlans[paymentPlans.length - 1].fee;

  return totalFee;
};

export const calculateSinglePlayerTotalPaid = async (playerId: number) => {
  return (
    await Payment.findOne({
      where: { playerId },
      attributes: [
        [
          sequelizeConnection.fn('SUM', sequelizeConnection.col('amount')),
          'amount',
        ],
      ],
      group: ['playerId'],
    })
  )?.dataValues?.amount;
};
