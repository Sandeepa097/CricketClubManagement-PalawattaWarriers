import express from 'express';
import authRouter from './authRouter';
import playerRouter from './playerRouter';
import matchRouter from './matchRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/players', playerRouter);
router.use('/matches', matchRouter);

export default router;
