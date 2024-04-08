import sequelizeConnection from '../config/sequelizeConnection';
import { OppositeTeam } from '../models';

interface CreateOppositeTeamAttributes {
  name: number;
}

interface FindOppositeTeamByIdAttributes {
  id: number;
}

interface FindOppositeTeamByNameAttributes {
  name: string;
}

export const createOppositeTeam = async (
  oppositeTeam: CreateOppositeTeamAttributes
) => {
  return await OppositeTeam.create({ ...oppositeTeam });
};

export const findOppositeTeam = async (
  oppositeTeam:
    | FindOppositeTeamByIdAttributes
    | FindOppositeTeamByNameAttributes
) => {
  if ((oppositeTeam as FindOppositeTeamByIdAttributes).id)
    return await OppositeTeam.findOne({
      where: { id: (oppositeTeam as FindOppositeTeamByIdAttributes).id },
    });

  return await OppositeTeam.findOne({
    where: {
      name: sequelizeConnection.where(
        sequelizeConnection.fn('LOWER', sequelizeConnection.col('name')),
        'LIKE',
        (oppositeTeam as FindOppositeTeamByNameAttributes).name.toLowerCase()
      ),
    },
  });
};

export const getOppositeTeams = async () => {
  return await OppositeTeam.findAll();
};
