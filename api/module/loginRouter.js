import express from 'express';
import { loginCheck } from '../../router/firebase/user.js';
import session from 'express-session';

const router = express.Router();


router.use(session({
    secret: 'ASDFHUIOA241278SZCVBJNKL12490ZXCVJNL',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour--
}));

router.use(express.json());

router.post('/user_login', (req, res) => {
    loginCheck(req.body.email, req.body.password).then(p => {
        if (p) {
            req.session.authenticated = true;
            req.session.name = p;
            res.send({ result: 'success', message: '로그인 성공' });
        }
        else {
            res.send({ result: 'fail', message: '비밀번호가 일치하지 않습니다.' })
        }
    }).catch(err => {
        console.log(err);
    })
});

router.get('/get_username', (req, res) => {
    if (req.session.authenticated) {
        res.send({ username: req.session.name });
    } else {
        res.send({ username: '' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send({ result: 'success', message: '로그아웃 성공' });
});



function ensureAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/html/login.html');
    }
}

router.use('/private', ensureAuthenticated, express.static('private', {
    extensions: ['html', 'htm']
}));

router.use(function (req, res, next) {
    if (!req.session.authenticated && req.path.startsWith('/private')) {
        res.redirect('/html/login.html');
    } else {
        next();
    }
});

export default router;