var express = require('express');
var userManager = require('./user/userManager');

var router = express.Router();

/* base url /users/* */

/* GET users listing. */

/* POST users listing. */
router.post('/login', function (req, res, next) {
    if (!req.body.email) return res.json({ error: 'email missing' });
    if (!req.body.password) return res.json({ error: 'password missing' });

    userManager.login(req.body.email, req.body.password, (err, user) => {
        if (err) return res.json({ error: err.message });

        req.session.user = user;
        req.session.chats = [];

        
        res.json({ error: false });
    });
});

router.post('/register', function (req, res, next) {
    if (!req.body.email) return res.json({ error: 'email missing' });
    if (!req.body.password) return res.json({ error: 'password missing' });
    if (!req.body.personal) return res.json({ error: 'personal missing' });

    userManager.create(req.body.email, req.body.password, req.body.personal, 'customer', (err, user) => {
        if (err) return res.json({ error: err.message });

        if (user) {
            if (req.body.message) {
                user.firstMessage = req.body.message;
                user.save();
            }

            userManager.sendVerification(user, (err) => {
                if (err) return res.json({ error: err.message });
                res.json({ error: false });
            });
        }
    });
});

router.post('/verify', function (req, res, next) {
    if (!req.body.token) return res.json({ error: 'token missing' });

    userManager.verify(req.body.token, (err)=>{
        if (err) return res.json({ error: err.message });

        res.json({ error: false });
    });
});

module.exports = router;
