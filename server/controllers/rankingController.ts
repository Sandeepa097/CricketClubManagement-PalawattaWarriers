import { Request, Response } from 'express';
import {
  getBattingRankings,
  getBowlingRankings,
  getFieldingRankings,
  getOverallRankings,
} from '../services/pointService';
import { StatusCodes } from 'http-status-codes';

const getRankings = async (req: Request, res: Response) => {
  const matchType = req.query.type as 'outdoor' | 'ppl' | null | undefined;
  const overallRankings = await getOverallRankings(matchType || 'outdoor');
  const battingRankings = await getBattingRankings(matchType || 'outdoor');
  const bowlingRankings = await getBowlingRankings(matchType || 'outdoor');
  const fieldingRankings = await getFieldingRankings(matchType || 'outdoor');

  return res.status(StatusCodes.OK).json({
    overallRankings,
    battingRankings,
    bowlingRankings,
    fieldingRankings,
  });
};

export default { getRankings };
