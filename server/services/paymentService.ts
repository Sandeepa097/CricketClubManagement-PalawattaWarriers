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

export const createBulkPayments = async (payments: PaymentAttributes[]) => {
  return await Payment.bulkCreate(payments as any[]);
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

export const getPayments = async (offset: number = 0, limit: number = 25) => {
  return await Payment.findAll({
    include: {
      model: Player,
      as: 'player',
    },
    order: [['id', 'DESC']],
    limit: limit,
    offset: offset,
  });
};

export const getPaymentsCount = async () => {
  return await Payment.count();
};

export const getOngoingPlan = async (date: { month: number; year: number }) => {
  const consideringDate = new Date(Date.UTC(date.year, date.month, 1, 0, 0, 0));
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
  const consideringDate = new Date(Date.UTC(date.year, date.month, 1, 0, 0, 0));

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

export const getDuePayments = async (date: { month: number; year: number }) => {
  const consideringDate = new Date(Date.UTC(date.year, date.month, 1, 0, 0, 0));
  const payersOfConsideringDate = await Player.findAll({
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

  return { due, duePlayers };
};

export const getProjectionsAndDues = async (date: {
  month: number;
  year: number;
}) => {
  const consideringDate = new Date(Date.UTC(date.year, date.month, 1, 0, 0, 0));
  const effectivePlan = await getOngoingPlan(date);
  const payersOfConsideringDate = await Player.findAll({
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
    if (dueAmount > effectivePlan?.dataValues.fee) {
      due += effectivePlan?.dataValues.fee;
    } else if (dueAmount > 0) {
      due += dueAmount;
    }
  }

  return { projected, due };
};

export const calculateSinglePlayerProjectedTotal = async (
  start: { month: number; year: number },
  end: { month: number; year: number }
) => {
  const startDate = new Date(Date.UTC(start.year, start.month, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(end.year, end.month, 1, 0, 0, 0));

  const futurePlans = await PaymentPlan.findAll({
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

  const paymentPlans = futurePlans.map((plan) => ({
    fee: plan.dataValues.fee,
    effectiveMonth: plan.dataValues.effectiveMonth,
    effectiveYear: plan.dataValues.effectiveYear,
  }));

  const firstPlan = await getOngoingPlan(start);
  const startLoop = {
    fee: firstPlan?.dataValues.fee,
    effectiveMonth: start.month,
    effectiveYear: start.year,
  };
  const endLoop = {
    fee: 0,
    effectiveYear: end.year,
    effectiveMonth: end.month,
  };

  paymentPlans.unshift(startLoop);
  paymentPlans.push(endLoop);

  let totalFee = 0;

  for (let i = 0; i < paymentPlans.length - 1; i++) {
    const months =
      (paymentPlans[i + 1].effectiveYear - paymentPlans[i].effectiveYear) * 12 +
      (paymentPlans[i + 1].effectiveMonth - paymentPlans[i].effectiveMonth);
    totalFee += months * paymentPlans[i].fee;
  }

  totalFee += paymentPlans[paymentPlans.length - 2].fee;

  return totalFee;
};

export const calculateSinglePlayerTotalPaid = async (playerId: number) => {
  const player = await Player.findOne({
    where: { id: playerId },
    attributes: [
      [
        sequelizeConnection.literal('IFNULL(SUM(`payments`.`amount`), 0)'),
        'totalPaid',
      ],
    ],
    include: [
      {
        model: Payment,
        as: 'payments',
      },
    ],
    group: ['Player.id'],
  });

  return player?.dataValues?.totalPaid || 0;
};
