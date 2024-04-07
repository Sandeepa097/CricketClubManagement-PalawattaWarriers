import express from 'express';
import authRouter from './authRouter';
import playerRouter from './playerRouter';
import matchRouter from './matchRouter';
import oppositeTeamRouter from './oppositeTeamRouter';
import rankingRouter from './rankingRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/players', playerRouter);
router.use('/matches', matchRouter);
router.use('/teams', oppositeTeamRouter);
router.use('/rankings', rankingRouter);

export default router;
