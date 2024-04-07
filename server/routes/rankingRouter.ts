import { Router } from 'express';
import rankingController from '../controllers/rankingController';

const rankingRouter = Router();

rankingRouter.get('/', rankingController.getRankings);

export default rankingRouter;
