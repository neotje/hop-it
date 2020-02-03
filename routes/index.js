var express = require('express');
var router = express.Router();
var config = require('config');

/* GET home page. */
router.get('/', function (req, res, next) {    
    res.render('index', { title: 'Hop-IT', path: req.path, session: req.session});
});

router.get('/portfolio', function (req, res, next) {
    res.render('portfolio', { title: 'Hop-IT Portfolio', path: req.path, projects: config.get("pages.portfolio.projects"), session: req.session});
});

router.get('/contact', function (req, res, next) {
    res.render('contact', { title: 'Hop-IT Contact', path: req.path, session: req.session});
});

module.exports = router;
