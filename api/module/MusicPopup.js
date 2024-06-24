import express from 'express';

const router = express.Router();

router.post('/music_popup', (req, res) => {
    res.redirect('html/music_popup.html');
});

export default router;