import express from 'express';
import { rigisterUser, get_salt } from '../../router/firebase/user.js';

const router = express.Router();

router.use(express.json());

router.post('/signup', (req, res) => {
    let data = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        salt: req.body.salt
    };
    rigisterUser(data).then(p => {
        if (p) {
            res.send({ result: 'signup', message: '회원가입 성공' });
        }
        else {
            res.send({ result: 'fail', message: '해당 계정은 이미 있거나 가입할 수 없습니다.' })
        }
    }).catch(err => {
        console.log(err + "rigisterUser error");
    })
});

router.post('/get_salt', (req, res) => {
    let data = {
        email: req.body.email
    };
    get_salt(data).then(p => {
        if (p) {
            res.send({ salt: p });
        }
        else {
            res.send({ salt: false });
        }
    }).catch(err => {
        console.log(err + "get_salt error");
    })
});

export default router;