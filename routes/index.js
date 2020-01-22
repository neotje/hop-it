var express = require('express');
var router = express.Router();
var config = require('config');
var chat = require('./chat/chat');

/* GET home page. */
router.get('/', function (req, res, next) {    
    res.render('index', { title: 'Hop-IT', path: req.path });
});

router.get('/portfolio', function (req, res, next) {
    res.render('portfolio', { title: 'Hop-IT Portfolio', path: req.path, projects: config.get("pages.portfolio.projects")});
});

module.exports = router;
