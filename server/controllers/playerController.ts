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
  findPlayer,
} from '../services/playerService';
import { deleteFile, uploadFile } from '../services/fileService';

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

  const player = await findPlayer(playerId);

  if (player?.dataValues.avatar && player?.dataValues.avatar !== avatar) {
    await deleteFile(player.dataValues.avatar);
  }

  if (avatar) {
    uploadedAvatarURL = await uploadFile(avatar);
  }

  const updatedPlayer = await updatePlayer(playerId, {
    avatar: uploadedAvatarURL,
    name,
    mainRoll,
    isCaptain,
    isWicketKeeper,
    feesPayingSince,
  });

  return res.status(StatusCodes.OK).json({
    message: 'Player updated successfully.',
  });
};

const remove = async (req: Request, res: Response) => {
  const playerId = Number(req.params.id);
  const player = await findPlayer(playerId);
  if (player?.dataValues.avatar) {
    await deleteFile(player.dataValues.avatar);
  }
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
  const ppl = {
    battingStats: await getPlayerBattingStats(id, 'ppl'),
    bowlingStats: await getPlayerBowlingStats(id, 'ppl'),
    matchesCount: await getPlayerMatchesCount(id, 'ppl'),
  };

  const outdoor = {
    battingStats: await getPlayerBattingStats(id, 'outdoor'),
    bowlingStats: await getPlayerBowlingStats(id, 'outdoor'),
    matchesCount: await getPlayerMatchesCount(id, 'outdoor'),
  };

  return res.status(StatusCodes.OK).json({ outdoor, ppl });
};

export default { create, update, remove, get, getStats };
