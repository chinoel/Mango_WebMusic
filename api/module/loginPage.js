import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
    res.redirect('html/login.html');
});

router.get('/get_error_message', (req, res) => {
    const errorMessage = req.session.error;
    delete req.session.error;
    res.send(errorMessage);
});

export default router;