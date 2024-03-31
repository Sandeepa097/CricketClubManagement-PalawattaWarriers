import { QueryInterface, DataTypes } from 'sequelize';

export = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('MatchPlayers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
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
    await queryInterface.dropTable('MatchPlayers');
  },
};
