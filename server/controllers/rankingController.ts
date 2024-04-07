import { Request, Response } from 'express';
import {
  getBattingRankings,
  getBowlingRankings,
  getFieldingRankings,
  getOverallRankings,
} from '../services/pointService';
import { StatusCodes } from 'http-status-codes';

const getRankings = async (req: Request, res: Response) => {
  const overallRankings = await getOverallRankings();
  const battingRankings = await getBattingRankings();
  const bowlingRankings = await getBowlingRankings();
  const fieldingRankings = await getFieldingRankings();

  return res.status(StatusCodes.OK).json({
    overallRankings,
    battingRankings,
    bowlingRankings,
    fieldingRankings,
  });
};

export default { getRankings };
