import express from 'express';
import authRouter from './authRouter';
import playerRouter from './playerRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/players', playerRouter);

export default router;
