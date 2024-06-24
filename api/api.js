import express from 'express';
const router = express.Router();

import loginRouter from './module/loginRouter.js';
import loginPage from './module/loginPage.js';
import MusicPopup from './module/MusicPopup.js';
import getData from './module/getData.js';
import youtubeGet from './module/youtubeGet.js';
import crtuserRouter from './module/crtuserRouter.js';
import review from './module/review.js';

router.use('/', loginRouter);
router.use('/', loginPage);
router.use('/', MusicPopup);
router.use('/', getData);
router.use('/', youtubeGet);
router.use('/', crtuserRouter);
router.use('/', review);

export default router;