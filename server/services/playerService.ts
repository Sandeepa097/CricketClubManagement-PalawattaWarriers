import { PlayerMainRolls } from '../constants/PlayerMainRolls';
import { Player } from '../models';

interface CreatePlayerAttributes {
  avatar: string | null;
  name: string;
  mainRoll: PlayerMainRolls;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
  feesPayingSince: {
    month: number;
    year: number;
  };
}

export const createPlayer = async (player: CreatePlayerAttributes) => {
  return await Player.create({ ...player });
};
