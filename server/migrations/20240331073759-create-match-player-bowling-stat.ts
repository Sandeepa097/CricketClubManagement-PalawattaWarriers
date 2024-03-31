import { QueryInterface, DataTypes } from 'sequelize';

export = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('MatchPlayerBowlingStats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      matchId: {
        allowNull: false,
        references: {
          model: 'Match',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER.UNSIGNED,
      },
      playerId: {
        allowNull: false,
        references: {
          model: 'Player',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER.UNSIGNED,
      },
      wickets: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      overs: {
        allowNull: false,
        type: Sequelize.DECIMAL(undefined, 1).UNSIGNED,
      },
      conceded: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      maidens: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
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
    await queryInterface.dropTable('MatchPlayerBowlingStats');
  },
};
