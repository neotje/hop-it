var express = require('express');
var router = express.Router();
var config = require('config');

var chatManager = require('./chat/chat');

/* GET user page. */
router.get('/', function (req, res, next) {
    if (!req.session.user) {
        res.render('user/login', { title: 'Hop-IT login', path: req.path, session: req.session });
    } else {
        res.render('user/dashboard', { title: 'Hop-IT profiel dashboard', path: req.path, session: req.session });
    }
});

router.get('/login', function (req, res, next) {
    res.render('user/login', { title: 'Hop-IT login', path: req.path, session: req.session });
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/chat', function (req, res, next) {
    console.log(req.session.user);

    if (!req.session.user) {
        res.render('user/login', { title: 'Hop-IT login', path: req.path, session: req.session });
    } else {
        if (req.session.user.role == 'admin') {
            chatManager.getChatList('admin', (err, chats) => {
                var l = []
                for (const chat of chats) {
                    var member;
                    for (const m of chat.members) {
                        if (m.uuid == 'admin') {
                            member = m;
                        }
                    }
                    l.push({
                        name: member.chatName,
                        uuid: chat.uuid
                    })
                }
                res.render('user/chat', { title: 'Hop-IT chat', path: req.path, session: req.session, chats: l });
            });
        } else {
            chatManager.getChatList(req.session.user.uuid, (err, chats) => {
                var l = []
                for (const chat of chats) {
                    var member;
                    for (const m of chat.members) {
                        if (m.uuid == req.session.user.uuid) {
                            member = m;
                        }
                    }
                    l.push({
                        name: member.chatName,
                        uuid: chat.uuid
                    })
                }
                res.render('user/chat', { title: 'Hop-IT chat', path: req.path, session: req.session, chats: l });
            });
        }
    }
});

module.exports = router;
