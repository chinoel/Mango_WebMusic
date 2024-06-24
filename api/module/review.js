import express from 'express';
import { review_update, review_get } from '../../router/firebase/review.js';

const router = express.Router();

router.post('/review_update', async (req, res) => {
    review_update(req.body).then(p => {
        if (p) {
            res.send({ result: 'success', message: '리뷰가 성공적으로 등록되었습니다.' });
        } else {
            res.send({ result: 'fail', message: '리뷰 등록에 실패했습니다.' });
        }
    } ).catch(err => {
        console.log(err);
    });
});

router.post('/review_load', async (req, res) => {
    const name = req.body.name;
    if (!name) {
        res.status(400).send({ error: 'Invalid document path' });
        return;
    }
    const data = await review_get({ name: name });
    res.json(data);
});

export default router;