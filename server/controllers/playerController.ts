import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createPlayer,
  getPlayerBowlingStats,
  getPlayerBattingStats,
  getPlayers,
  removePlayer,
  updatePlayer,
  getPlayerMatchesCount,
} from '../services/playerService';
import { isBase64, uploadFile } from '../services/fileService';

const create = async (req: Request, res: Response) => {
  const { avatar, name, mainRoll, isCaptain, isWicketKeeper, feesPayingSince } =
    req.body;

  let uploadedAvatarURL: string | null = null;

  if (avatar) {
    uploadedAvatarURL = await uploadFile(avatar);
  }

  const createdPlayer = await createPlayer({
    avatar: uploadedAvatarURL,
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

const update = async (req: Request, res: Response) => {
  const playerId = Number(req.params.id);
  const { avatar, name, mainRoll, isCaptain, isWicketKeeper, feesPayingSince } =
    req.body;

  let uploadedAvatarURL: string | null = null;

  if (avatar && isBase64(avatar)) {
    uploadedAvatarURL = await uploadFile(avatar);
  }

  const updatedPlayer = await updatePlayer(playerId, {
    name,
    mainRoll,
    isCaptain,
    isWicketKeeper,
    feesPayingSince,
    ...(uploadedAvatarURL ? { avatar: uploadedAvatarURL } : {}),
  });

  return res.status(StatusCodes.OK).json({
    message: 'Player updated successfully.',
  });
};

const remove = async (req: Request, res: Response) => {
  const playerId = Number(req.params.id);
  await removePlayer(playerId);

  return res
    .status(StatusCodes.NO_CONTENT)
    .json({ message: 'Player removed successfully.' });
};

const get = async (req: Request, res: Response) => {
  const players = await getPlayers();
  return res.status(StatusCodes.OK).json({ players });
};

const getStats = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pplStats = {
    battingStats: await getPlayerBattingStats(id, 'ppl'),
    bowlingStats: await getPlayerBowlingStats(id, 'ppl'),
    matchesCount: await getPlayerMatchesCount(id, 'ppl'),
  };

  const outdoorStats = {
    battingStats: await getPlayerBattingStats(id, 'outdoor'),
    bowlingStats: await getPlayerBowlingStats(id, 'outdoor'),
    matchesCount: await getPlayerMatchesCount(id, 'outdoor'),
  };

  return res.status(StatusCodes.OK).json({ outdoorStats, pplStats });
};

export default { create, update, remove, get, getStats };
