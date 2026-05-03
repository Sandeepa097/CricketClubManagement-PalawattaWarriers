import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('Matches', 'pplGroupId', {
      allowNull: true,
      defaultValue: null,
      type: DataTypes.UUID,
      references: {
        model: 'PPLGroups',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Matches', 'pplTeamSide', {
      allowNull: true,
      defaultValue: null,
      type: DataTypes.ENUM('teamA', 'teamB'),
    });

    await queryInterface.addIndex('Matches', ['pplGroupId']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex('Matches', ['pplGroupId']);
    await queryInterface.removeColumn('Matches', 'pplTeamSide');
    await queryInterface.removeColumn('Matches', 'pplGroupId');
  },
};
