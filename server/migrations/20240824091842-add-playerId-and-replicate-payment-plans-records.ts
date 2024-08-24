import { QueryInterface, DataTypes, QueryTypes, Op } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE `PaymentPlans` ADD `playerId` INTEGER AFTER `id`;'
    );

    await queryInterface.changeColumn('PaymentPlans', 'playerId', {
      allowNull: true,
      type: DataTypes.INTEGER.UNSIGNED,
    });

    const players = await queryInterface.sequelize.query(
      'SELECT id FROM Players;',
      { type: QueryTypes.SELECT }
    );

    const paymentPlans = await queryInterface.sequelize.query(
      'SELECT * FROM PaymentPlans;',
      { type: QueryTypes.SELECT }
    );

    const newPaymentPlans: any[] = [];
    paymentPlans.forEach((plan: any) => {
      players.forEach((player: any) => {
        const newPlan = { ...plan, playerId: player.id };
        delete newPlan.id;
        newPaymentPlans.push(newPlan);
      });
    });

    if (newPaymentPlans.length > 0) {
      await queryInterface.bulkInsert('PaymentPlans', newPaymentPlans);
    }

    await queryInterface.bulkDelete('PaymentPlans', {
      playerId: null,
    });

    await queryInterface.changeColumn('PaymentPlans', 'playerId', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Players',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    const originalPlans: any[] = await queryInterface.sequelize.query(
      `
      SELECT fee, effectiveMonth, effectiveYear
      FROM PaymentPlans
      GROUP BY fee, effectiveMonth, effectiveYear
      HAVING COUNT(*) > 1
      `,
      { type: QueryTypes.SELECT }
    );

    for (const plan of originalPlans) {
      await queryInterface.bulkDelete('PaymentPlans', {
        playerId: { [Op.not]: null },
        fee: plan.fee,
        effectiveMonth: plan.effectiveMonth,
        effectiveYear: plan.effectiveYear,
      });
    }

    await queryInterface.removeColumn('PaymentPlans', 'playerId');
  },
};
