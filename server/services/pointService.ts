import { Op } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import {
  Match,
  MatchPlayerBattingStat,
  MatchPlayerBowlingStat,
  MatchPlayerFieldingStat,
  Player,
} from '../models';

interface BattingStatsInterface {
  score?: number;
  balls: number;
  sixes?: number;
  fours?: number;
  isOut?: boolean;
}

interface BowlingStatsInterface {
  wickets?: number;
  overs: number;
  conceded?: number;
  maidens?: number;
  numberOfDeliveriesPerOver?: number;
}

interface FieldingStatsInterface {
  catches?: number;
  stumps?: number;
  directHits?: number;
  indirectHits?: number;
}

export const calculateBattingPoints = ({
  score,
  balls,
  sixes,
  fours,
  isOut,
}: BattingStatsInterface) => {
  let totalPoints: number = 0;

  // 1 point if scored
  if (score && score > 0) totalPoints++;

  // 2 points per six off one ball
  totalPoints += 2 * (sixes || 0);

  // 1 point per four off one ball
  totalPoints += fours || 0;

  // Minus 10 points if dismissed for duck
  if (isOut && !score) totalPoints -= 10;

  // Points for strike rate
  const strikeRate: number = ((score || 0) / balls) * 100;
  if (strikeRate < 50) totalPoints -= 10;

  // Points for strike rate if scored more than 10 runs
  if ((score || 0) < 10) return { totalPoints, strikeRate };

  if (strikeRate >= 100 && strikeRate < 125) totalPoints += 10;
  else if (strikeRate >= 125 && strikeRate < 150) totalPoints += 20;
  else if (strikeRate >= 150 && strikeRate < 175) totalPoints += 30;
  else if (strikeRate >= 175 && strikeRate < 200) totalPoints += 40;
  else if (strikeRate >= 200) totalPoints += 50;

  // Points for every 10 runs
  if ((score || 0) >= 10) totalPoints += 10;
  if ((score || 0) >= 20) totalPoints += 20;
  if ((score || 0) >= 30) totalPoints += 30;
  if ((score || 0) >= 40) totalPoints += 40;
  if ((score || 0) >= 50) totalPoints += 50;
  if ((score || 0) > 50) totalPoints += (score || 0) * 2;

  return { totalPoints, strikeRate };
};

export const calculateBowlingPoints = ({
  wickets,
  overs,
  conceded,
  maidens,
  numberOfDeliveriesPerOver,
}: BowlingStatsInterface) => {
  let totalPoints: number = 0;

  // 40 points if maidens bowled
  if ((maidens || 0) > 0) totalPoints += 40;

  // Points for every wicket
  if ((wickets || 0) >= 1) totalPoints += 20;
  if ((wickets || 0) >= 2) totalPoints += 10;
  if ((wickets || 0) >= 3) totalPoints += 20;
  if ((wickets || 0) >= 4) totalPoints += 40;
  if ((wickets || 0) >= 5) totalPoints += 80;

  // Calculate total number of overs bowled if six deliveries in an over
  const totalNumberOfBalls =
    Math.floor(overs) * (numberOfDeliveriesPerOver || 6) +
    (overs - Math.floor(overs)) * 10;
  const oversIfSixDeliveriesPerOver =
    Math.floor(totalNumberOfBalls / 6) + (totalNumberOfBalls % 6) / 10;

  // Points for economy if bowled at least 2 overs
  const economy = (conceded || 0) / oversIfSixDeliveriesPerOver;
  if (oversIfSixDeliveriesPerOver < 2) return { totalPoints, economy };

  if (economy < 2) totalPoints += 30;
  else if (economy < 4) totalPoints += 20;
  else if (economy < 6) totalPoints += 10;
  else if (economy < 8) totalPoints += 0;
  else if (economy < 10) totalPoints -= 10;
  else if (economy < 12) totalPoints -= 20;
  else if (economy >= 12) totalPoints -= 30;

  return { totalPoints, economy };
};

export const calculateFieldingPoints = ({
  catches,
  stumps,
  directHits,
  indirectHits,
}: FieldingStatsInterface) => {
  let totalPoints: number = 50; // Always getting 50 points if an official player of the match

  totalPoints += 10 * (catches || 0);
  totalPoints += 20 * (stumps || 0);
  totalPoints += 20 * (directHits || 0);
  totalPoints += 10 * (indirectHits || 0);

  return totalPoints;
};

export const getBattingRankings = async (matchType: 'outdoor' | 'ppl') => {
  return await Player.findAll({
    subQuery: false,
    group: ['Player.id'],
    attributes: [
      'id',
      'name',
      'avatar',
      [
        sequelizeConnection.literal('IFNULL(SUM(`battingStats`.`points`), 0)'),
        'points',
      ],
    ],
    include: [
      {
        model: MatchPlayerBattingStat,
        as: 'battingStats',
        attributes: [],
        include: [
          {
            model: Match,
            as: 'match',
            attributes: ['id', 'oppositeTeamId'],
            where: {
              oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
            },
          },
        ],
      },
    ],
    order: [['points', 'DESC']],
    limit: 10,
  });
};

export const getBowlingRankings = async (matchType: 'outdoor' | 'ppl') => {
  return await Player.findAll({
    subQuery: false,
    group: ['Player.id'],
    attributes: [
      'id',
      'name',
      'avatar',
      [
        sequelizeConnection.literal('IFNULL(SUM(`bowlingStats`.`points`), 0)'),
        'points',
      ],
    ],
    include: [
      {
        model: MatchPlayerBowlingStat,
        as: 'bowlingStats',
        attributes: [],
        include: [
          {
            model: Match,
            as: 'match',
            attributes: ['id', 'oppositeTeamId'],
            where: {
              oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
            },
          },
        ],
      },
    ],
    order: [['points', 'DESC']],
    limit: 10,
  });
};

export const getFieldingRankings = async (matchType: 'outdoor' | 'ppl') => {
  return await Player.findAll({
    subQuery: false,
    group: ['Player.id'],
    attributes: [
      'id',
      'name',
      'avatar',
      [
        sequelizeConnection.literal('IFNULL(SUM(`fieldingStats`.`points`), 0)'),
        'points',
      ],
    ],
    include: [
      {
        model: MatchPlayerFieldingStat,
        as: 'fieldingStats',
        attributes: [],
        include: [
          {
            model: Match,
            as: 'match',
            attributes: ['id', 'oppositeTeamId'],
            where: {
              oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
            },
          },
        ],
      },
    ],
    order: [['points', 'DESC']],
    limit: 10,
  });
};

export const getOverallRankings = async (matchType: 'outdoor' | 'ppl') => {
  const matchCondition = matchType === 'outdoor' ? 'IS NOT NULL' : 'IS NULL';
  return await Player.findAll({
    attributes: [
      'id',
      'name',
      'avatar',
      [
        sequelizeConnection.literal(
          `(SELECT IFNULL(SUM(MPBS.\`points\`), 0) FROM \`MatchPlayerBattingStats\` MPBS JOIN \`Matches\` M ON MPBS.\`matchId\` = M.\`id\` WHERE MPBS.\`playerId\` = \`Player\`.\`id\` AND M.\`oppositeTeamId\` ${matchCondition}) + (SELECT IFNULL(SUM(MPFS.\`points\`), 0) FROM \`MatchPlayerFieldingStats\` MPFS JOIN \`Matches\` M ON MPFS.\`matchId\` = M.\`id\` WHERE MPFS.\`playerId\` = \`Player\`.\`id\` AND M.\`oppositeTeamId\` ${matchCondition}) + (SELECT IFNULL(SUM(MPBS.\`points\`), 0) FROM \`MatchPlayerBowlingStats\` MPBS JOIN \`Matches\` M ON MPBS.\`matchId\` = M.\`id\` WHERE MPBS.\`playerId\` = \`Player\`.\`id\` AND M.\`oppositeTeamId\` ${matchCondition})`
        ),
        'points',
      ],
    ],
    order: [['points', 'DESC']],
    limit: 10,
  });
};
