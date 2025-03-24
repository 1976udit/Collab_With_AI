import {Router} from 'express';
import * as aiController from '../controllers/ai.controller.js';

const router = Router();

router.get('/result', aiController.getContent);


export default router;