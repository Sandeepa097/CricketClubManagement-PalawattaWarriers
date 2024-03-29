import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createPlayer } from '../services/playerService';

const create = async (req: Request, res: Response) => {
  const { avatar, name, mainRoll, isCaptain, isWicketKeeper, feesPayingSince } =
    req.body;

  const createdPlayer = await createPlayer({
    avatar,
    name,
    mainRoll,
    isCaptain,
    isWicketKeeper,
    feesPayingSince,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Player created successfully.', player: createdPlayer });
};

export default { create };
