import { OppositeTeam } from '../models';

interface CreateOppositeTeamAttributes {
  name: number;
}

export const createOppositeTeam = async (
  oppositeTeam: CreateOppositeTeamAttributes
) => {
  return await OppositeTeam.create({ ...oppositeTeam });
};

export const findOppositeTeam = async (id: number) => {
  return await OppositeTeam.findOne({ where: { id } });
};
