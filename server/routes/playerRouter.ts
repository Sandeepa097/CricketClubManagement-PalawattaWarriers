import { Router } from 'express';
import { validatePermissions, validateRequest } from './validator';
import { UserTypes } from '../constants/UserTypes';
import { body, param } from 'express-validator';
import { AllowedFileMimeTypes } from '../constants/AllowedFileMimeTypes';
import { AllowedFileByteSizes } from '../constants/AllowedFileByteSizes';
import { PlayerMainRolls } from '../constants/PlayerMainRolls';
import playerController from '../controllers/playerController';
import { isBase64, isUrl } from '../services/fileService';
import { findPlayer } from '../services/playerService';
import fileType = require('file-type');

const playerValidations = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('mainRoll')
    .notEmpty()
    .withMessage('Main roll is required.')
    .custom((value) => {
      return [
        PlayerMainRolls.BATSMAN,
        PlayerMainRolls.BOWLER,
        PlayerMainRolls.ALL_ROUNDER,
      ].includes(value);
    }),
  body('isCaptain').isBoolean().withMessage('Captain must be a boolean value.'),
  body('isWicketKeeper')
    .isBoolean()
    .withMessage('Wicket keeper must be a boolean value.'),
  body('feesPayingSince.month')
    .isInt({ max: 11, min: 0 })
    .withMessage('Fees paying month must be an integer between 0 and 11.'),
  body('feesPayingSince.year')
    .isInt({ min: 1 })
    .withMessage('Fees paying year must be positive integer.'),
];

const playerRouter = Router();

playerRouter.post(
  '/',
  validatePermissions(UserTypes.ADMIN),
  validateRequest([
    body('avatar').custom(async (value) => {
      if (!value) return true;

      const base64Image: string = value;

      const buffer = Buffer.from(
        base64Image.replace(/^data:image\/[a-z]+;base64,/, ''),
        'base64'
      );
      const detectedType = await fileType.fromBuffer(buffer);

      if (
        !detectedType ||
        !detectedType.mime.startsWith(AllowedFileMimeTypes.PLAYER_AVATAR)
      ) {
        throw new Error('Avatar must be an image.');
      }

      if (buffer.length > AllowedFileByteSizes.PLAYER_AVATAR) {
        throw new Error(
          `Avatar is too large. Maximum size is ${
            AllowedFileByteSizes.PLAYER_AVATAR / 1000
          }MB.`
        );
      }

      return true;
    }),
    ...playerValidations,
  ]),
  playerController.create
);

playerRouter.get('/', playerController.get);

playerRouter.put(
  '/:id',
  validatePermissions(UserTypes.ADMIN),
  validateRequest([
    param('id')
      .exists()
      .toInt()
      .custom(async (value) => {
        const player = await findPlayer(value);
        if (!player) throw Error('Player id is invalid.');
        return true;
      }),
    body('avatar').custom(async (value) => {
      if (!value) return true;

      if (isBase64(value)) {
        const buffer = Buffer.from(value, 'base64');
        const detectedType = await fileType.fromBuffer(buffer);

        if (
          !detectedType ||
          !detectedType.mime.startsWith(AllowedFileMimeTypes.PLAYER_AVATAR)
        ) {
          throw new Error('Avatar must be an image.');
        }

        if (buffer.length > AllowedFileByteSizes.PLAYER_AVATAR) {
          throw new Error(
            `Avatar is too large. Maximum size is ${
              AllowedFileByteSizes.PLAYER_AVATAR / 1000
            }MB.`
          );
        }
      }

      if (isUrl(value)) return true;

      throw Error('Avatar must be an URL or base64 string.');
    }),
    ...playerValidations,
  ]),
  playerController.update
);

playerRouter.get('/:id/stats', playerController.getStats);

playerRouter.delete(
  '/:id',
  validatePermissions(UserTypes.ADMIN),
  validateRequest([
    param('id')
      .exists()
      .toInt()
      .custom(async (value) => {
        const player = await findPlayer(value);
        if (!player) throw Error('Player id is invalid.');
        return true;
      }),
  ]),
  playerController.remove
);

export default playerRouter;
