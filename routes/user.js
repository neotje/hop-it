var express = require('express');
var router = express.Router();
var config = require('config');

/* GET user page. */
router.get('/', function (req, res, next) {        
    if (!req.session.user) {        
        res.render('user/login', { title: 'Hop-IT login', path: req.path, session: req.session});
    } else {
        res.render('user/chat', { title: 'Hop-IT profiel dashboard', path: req.path, session: req.session});
    }
});

router.get('/chat', function (req, res, next) {        
    if (!req.session.user) {        
        res.render('user/login', { title: 'Hop-IT login', path: req.path, session: req.session});
    } else {
        res.render('user/chat', { title: 'Hop-IT chat', path: req.path, session: req.session});
    }
});

module.exports = router;
