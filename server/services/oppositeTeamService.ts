import { OppositeTeam } from '../models';

interface CreateOppositeTeamAttributes {
  name: number;
}

export const createOppositeTeam = async (
  oppositeTeam: CreateOppositeTeamAttributes
) => {
  return await OppositeTeam.create({ ...oppositeTeam });
};
