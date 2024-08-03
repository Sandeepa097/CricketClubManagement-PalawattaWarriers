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

  // Minus 2 points if dismissed for duck
  if (isOut && !score) totalPoints -= 2;

  // Points for strike rate
  const strikeRate: number = ((score || 0) / (balls || 1)) * 100;
  if (strikeRate < 50 && (isOut || balls)) totalPoints -= 6;

  if ((score || 0) < 10)
    return { totalPoints, strikeRate: Number(strikeRate.toFixed(3)) };

  // Points for strike rate if scored more than 10 runs
  if (strikeRate >= 50 && strikeRate < 75) totalPoints -= 4;
  else if (strikeRate >= 75 && strikeRate < 100) totalPoints -= 2;
  else if (strikeRate >= 100 && strikeRate < 125) totalPoints += 1;
  else if (strikeRate >= 125 && strikeRate < 150) totalPoints += 3;
  else if (strikeRate >= 150 && strikeRate < 175) totalPoints += 5;
  else if (strikeRate >= 175 && strikeRate < 200) totalPoints += 7;
  else if (strikeRate >= 200) totalPoints += 9;

  // Points for every 10 runs
  if ((score || 0) >= 50) totalPoints += 8;
  else if ((score || 0) >= 40) totalPoints += 6;
  else if ((score || 0) >= 30) totalPoints += 4;
  else if ((score || 0) >= 20) totalPoints += 2;
  else if ((score || 0) >= 10) totalPoints += 1;

  // Half century or century bonus
  if ((score || 0) >= 50 && (score || 0) < 100) totalPoints += 8;
  else if ((score || 0) >= 100) totalPoints += 20;

  return { totalPoints, strikeRate: Number(strikeRate.toFixed(3)) };
};

export const calculateBowlingPoints = ({
  wickets,
  overs,
  conceded,
  maidens,
  numberOfDeliveriesPerOver,
}: BowlingStatsInterface) => {
  let totalPoints: number = 0;

  // 15 points if maidens bowled
  if ((maidens || 0) > 0) totalPoints += (maidens || 0) * 15;

  // 20 points if a wicket taken
  if ((wickets || 0) >= 1) totalPoints += 20;

  // Points for wickets
  if ((wickets || 0) >= 5) totalPoints += 12;
  else if ((wickets || 0) >= 4) totalPoints += 8;
  else if ((wickets || 0) >= 3) totalPoints += 5;
  else if ((wickets || 0) >= 2) totalPoints += 3;

  // Calculate total number of overs bowled if six deliveries in an over
  const totalNumberOfBalls =
    Math.floor(overs) * (numberOfDeliveriesPerOver || 6) +
    (overs - Math.floor(overs)) * 10;
  const oversIfSixDeliveriesPerOver =
    Math.floor(totalNumberOfBalls / 6) + (totalNumberOfBalls % 6) / 10;

  // Calculate economy
  const economy = (conceded || 0) / (oversIfSixDeliveriesPerOver || 1);
  if ((overs || 0) < 1)
    return { totalPoints, economy: Number(economy.toFixed(3)) };

  // Points for economy if bowled at least 1 over
  if (economy < 2) totalPoints += 10;
  else if (economy < 4) totalPoints += 7;
  else if (economy < 6) totalPoints += 5;
  else if (economy < 8) totalPoints += 2;
  else if (economy < 10) totalPoints -= 1;
  else if (economy < 12) totalPoints -= 3;
  else if (economy >= 12) totalPoints -= 5;

  return { totalPoints, economy: Number(economy.toFixed(3)) };
};

export const calculateFieldingPoints = ({
  catches,
  stumps,
  directHits,
  indirectHits,
}: FieldingStatsInterface) => {
  let totalPoints: number = 0;

  // 8 points for each catch taken
  totalPoints += (catches || 0) * 8;

  // 3 catch bonus
  if ((catches || 0) >= 3) totalPoints += 4;

  // 12 points for each stump and direct run out taken
  totalPoints += (stumps || 0) * 12;
  totalPoints += (directHits || 0) * 12;

  // 6 points for each indirect run out taken
  totalPoints += (indirectHits || 0) * 6;

  return totalPoints;
};

export const recalculateBattingPoints = async () => {
  try {
    const records = await MatchPlayerBattingStat.findAll();

    for (const record of records) {
      const { balls, score, sixes, fours, isOut } = record;

      const newResults = calculateBattingPoints({
        score,
        balls,
        sixes,
        fours,
        isOut,
      });

      await record.update({
        points: newResults.totalPoints,
        strikeRate: newResults.strikeRate,
      });

      return true;
    }
  } catch (error) {
    return false;
  }
};

export const recalculateBowlingPoints = async () => {
  try {
    const records: any = await MatchPlayerBowlingStat.findAll({
      include: [
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'numberOfDeliveriesPerOver'],
        },
      ],
    });

    for (const record of records) {
      const { wickets, overs, conceded, maidens } = record;
      const numberOfDeliveriesPerOver = record.match.numberOfDeliveriesPerOver;

      const newResults = calculateBowlingPoints({
        wickets,
        overs,
        conceded,
        maidens,
        numberOfDeliveriesPerOver,
      });

      await record.update({
        points: newResults.totalPoints,
        economy: newResults.economy,
      });

      return true;
    }
  } catch (error) {
    return false;
  }
};

export const recalculateFieldingPoints = async () => {
  try {
    const records = await MatchPlayerFieldingStat.findAll();

    for (const record of records) {
      const { catches, stumps, directHits, indirectHits } = record;

      const newPoints = calculateFieldingPoints({
        catches,
        stumps,
        directHits,
        indirectHits,
      });

      await record.update({
        points: newPoints,
      });

      return true;
    }
  } catch (error) {
    return false;
  }
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
