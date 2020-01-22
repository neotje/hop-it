"use strict";

const config = require('config');
const mongoose = require('mongoose');
const test = config.get('test');
const userManager = require('../user/userManager')

// connect to database
mongoose.connect(config.get('userManager.mongodb'), { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });

var chatSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name missing'] },
    members: [{}],
    messages: [{}]
});

var Chat = mongoose.model("Chat", chatSchema);

exports.create = function (name, membersArr, callback) {
    if (membersArr.length < 2) {
        callback(new Error("To create a chat you need at least 2 members"));
    } else {
        next(0);
    }

    function next(i) {
        if (i < membersArr.length) {
            userManager.isUser(membersArr[i].id, (result) => {
                if (!result) {
                    callback(new Error('One of the members does not exist!'));
                } else {
                    i++;
                    next(i);
                }
            });
        } else {
            create();
        }
    }

    function create() {
        Chat.create({
            name: 'test',
            members: members
        }, (err, newChat) => {
            if (err) return callback(err);
            callback(true);
        });
    }
}

exports.session = class {
    constructor(user, chatId) {
        var db = mongoose.connect(config.get('userManager.mongodb'), { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });
    }
}
