import {Router} from 'express';
import * as aiController from '../controllers/ai.controller.js';

const router = Router();

router.get('/result', aiController.getContent);
router.post("/get-review", aiController.getReview);


export default router;