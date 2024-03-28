import { QueryInterface, DataTypes } from 'sequelize';

export = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      avatar: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mainRoll: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isCaptain: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      isWicketKeeper: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      feesPayingMonth: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      feesPayingYear: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('Players');
  },
};
