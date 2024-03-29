import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createPlayer } from '../services/playerService';
import { uploadFile } from '../services/fileService';

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

export default { create };
