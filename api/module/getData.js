import express from 'express';
import bodyParser from 'body-parser';
import { getrank } from '../../router/firebase/rank.js';

const router = express.Router();

router.use(bodyParser.json());

router.post('/load_data', (req, res) => {
    const genre = req.body.genre;

    getrank(genre).then(tre => {
        res.send(tre);
    }).catch(err => {
        console.log(err);
    })
});

export default router;