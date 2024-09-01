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
      'SELECT * FROM Players;',
      { type: QueryTypes.SELECT }
    );

    await queryInterface.sequelize.query('TRUNCATE TABLE `PaymentPlans`;');

    const newPaymentPlans: any[] = [];
    players.forEach((player: any) => {
      const newPlan = {
        fee: 500,
        playerId: player.id,
        effectiveMonth: player.feesPayingMonth,
        effectiveYear: player.feesPayingYear,
        createdAt: player.createdAt,
        updatedAt: player.updatedAt,
      };
      newPaymentPlans.push(newPlan);
    });

    if (newPaymentPlans.length > 0) {
      await queryInterface.bulkInsert('PaymentPlans', newPaymentPlans);
    }

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
    await queryInterface.sequelize.query('TRUNCATE TABLE `PaymentPlans`;');

    await queryInterface.sequelize.query(
      'ALTER TABLE `PaymentPlans` DROP CONSTRAINT `paymentplans_ibfk_1`;'
    );

    await queryInterface.sequelize.query(
      'ALTER TABLE `PaymentPlans` DROP COLUMN `playerId`;'
    );

    await queryInterface.bulkInsert('PaymentPlans', [
      {
        fee: 500,
        effectiveMonth: 0,
        effectiveYear: 1970,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fee: 500,
        effectiveMonth: 0,
        effectiveYear: 2024,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
};
