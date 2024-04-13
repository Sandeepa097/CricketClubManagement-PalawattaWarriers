import { QueryInterface, DataTypes } from 'sequelize';

export = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('MatchPlayerBattingStats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      matchId: {
        allowNull: false,
        references: {
          model: 'Matches',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER.UNSIGNED,
      },
      playerId: {
        allowNull: false,
        references: {
          model: 'Players',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER.UNSIGNED,
      },
      score: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      balls: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      sixes: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      fours: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      isOut: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      strikeRate: {
        allowNull: false,
        type: Sequelize.DECIMAL(7, 3).UNSIGNED,
      },
      points: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable('MatchPlayerBattingStats');
  },
};
