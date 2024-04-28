import { Router } from 'express';
import { body, param } from 'express-validator';
import { validatePermissions, validateRequest } from './validator';
import matchController from '../controllers/matchController';
import { UserTypes } from '../constants/UserTypes';
import { findOppositeTeam } from '../services/oppositeTeamService';
import { findPlayer } from '../services/playerService';
import { findMatch } from '../services/matchService';

const MatchValidations = [
  body('isPPL').toBoolean().isBoolean(),
  body('title').notEmpty().withMessage('Match title is required.'),
  body('oppositeTeamId')
    .if(({ req }) => {
      return !req.body.isPPL;
    })
    .isInt()
    .toInt()
    .custom(async (value) => {
      const oppositeTeam = await findOppositeTeam({ id: value });
      if (!oppositeTeam) throw Error('Opposite team is invalid.');
      return true;
    }),
  body('date').notEmpty().withMessage('Date is required.'),
  body('location').notEmpty().withMessage('Location is required.'),
  body('result')
    .if(({ req }) => {
      return !req.body.isPPL;
    })
    .custom((value) => {
      if (value !== 'won' && value !== 'lost' && value !== 'draw')
        throw Error('Result is invalid.');
      return true;
    }),
  body('numberOfDeliveriesPerOver')
    .isInt({ min: 1, max: 10 })
    .withMessage(
      'Number of deliveries for an over should be between 1 and 10.'
    ),
  body('officialPlayers')
    .optional()
    .isArray()
    .withMessage('Official players must be an array.'),
  body('officialPlayers.*')
    .toInt()
    .custom(async (value) => {
      if (!value) return true;
      const player = await findPlayer(value);
      if (!player) throw Error('Official player id is invalid.');
      return true;
    }),
  body('battingStats')
    .optional()
    .isArray()
    .withMessage('Batting stats must be an array.'),
  body('battingStats.*.id')
    .notEmpty()
    .withMessage('Batting stats player id is required.')
    .toInt()
    .custom(async (value) => {
      const player = await findPlayer(value);
      if (!player) throw Error('Batting stats player id is invalid.');
      return true;
    }),
  body('battingStats.*.values.score')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Score must be an unsigned integer.'),
  body('battingStats.*.values.balls')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Balls must be an unsigned integer.'),
  body('battingStats.*.values.sixes')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Number of sixes must be an unsigned integer.'),
  body('battingStats.*.values.fours')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Number of fours must be an unsigned integer.'),
  body('battingStats.*.values.isOut')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('Is out must be a boolean.'),
  body('bowlingStats')
    .optional()
    .isArray()
    .withMessage('Bowling stats must be an array.'),
  body('bowlingStats.*.id')
    .notEmpty()
    .withMessage('Bowling stats player id is required.')
    .toInt()
    .custom(async (value) => {
      const player = await findPlayer(value);
      if (!player) throw Error('Bowling stats player id is invalid.');
      return true;
    }),
  body('bowlingStats.*.values.wickets')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Number of wickets must be an unsigned integer.'),
  body('bowlingStats.*.values.overs')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('Number of overs must be an unsigned decimal.'),
  body('bowlingStats.*.values.conceded')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Runs conceded must be an unsigned integer.'),
  body('bowlingStats.*.values.maidens')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Number of maidens must be an unsigned integer.'),
  body('fieldingStats')
    .optional()
    .isArray()
    .withMessage('Fielding stats must be an array.'),
  body('fieldingStats.*.id')
    .notEmpty()
    .withMessage('Fielding stats player id is required.')
    .toInt()
    .custom(async (value) => {
      const player = await findPlayer(value);
      if (!player) throw Error('Fielding stats player id is invalid.');
      return true;
    }),
  body('fieldingStats.*.values.catches')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Number of catches must be an unsigned integer.'),
  body('fieldingStats.*.values.stumps')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Number of stumps must be an unsigned integer.'),
  body('fieldingStats.*.values.directHits')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Number of direct hits must be an unsigned integer.'),
  body('fieldingStats.*.values.indirectHits')
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage('Number of indirect hits must be an unsigned integer.'),
];

const matchRouter = Router();

matchRouter.post(
  '/',
  validatePermissions(UserTypes.ADMIN),
  validateRequest([...MatchValidations]),
  matchController.create
);

matchRouter.get('/', matchController.get);

matchRouter.put(
  '/:id',
  validatePermissions(UserTypes.ADMIN),
  validateRequest([
    param('id')
      .exists()
      .toInt()
      .custom(async (value) => {
        const match = await findMatch(value);
        if (!match) throw Error('Match id is invalid.');
        return true;
      }),
    ...MatchValidations,
  ]),
  matchController.update
);

matchRouter.delete(
  '/:id',
  validatePermissions(UserTypes.ADMIN),
  validateRequest([
    param('id')
      .exists()
      .toInt()
      .custom(async (value) => {
        const match = await findMatch(value);
        if (!match) throw Error('Match id is invalid.');
        return true;
      }),
  ]),
  matchController.remove
);

export default matchRouter;
