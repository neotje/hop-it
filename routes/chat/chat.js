"use strict";

const config = require('config');
const mongoose = require('mongoose');
const userManager = require('../user/userManager');
const uuidv4 = require('uuid/v4');

const ChatService = require('chat-service');
const service = new ChatService(options, hooks);

exports.create = function (whitelist) {
    var owner = 'admin'
    var whitelistOnly = true
    var state = { owner, whitelistOnly, whitelist }
    chatService.addRoom('someRoom', state).then(fn)
}




/*
// connect to database
mongoose.connect(config.get('userManager.mongodb'), { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });

var memberSchema = new mongoose.Schema({
    id: { type: String, required: [true, 'id missing'] },
    name: { type: String, required: [true, 'name missing'] }
});

var messageSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    sender: memberSchema,
    type: { type: String, default: "text", required: [true, 'type missing'] },
    content: { type: String, required: [true, 'content missing'] }
});

var chatSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name missing'] },
    members: [memberSchema],
    messages: [messageSchema]
});

var Chat = mongoose.model("Chat", chatSchema);

exports.create = function (name, membersArr, callback) {
    var error;

    if (membersArr.length < 2) {
        callback(new Error("To create a chat you need at least 2 members"));
    } else {
        next(0);
    }

    function next(i) {
        if (i < membersArr.length) {
            console.log(membersArr[i].id);

            if (membersArr[i].id == "admin") {
                i++;
                next(i);
            } else {
                userManager.isUser(mongoose.Types.ObjectId(membersArr[i].id), (result) => {
                    if (!result) {
                        callback(new Error('One of the members does not exist!'));
                    } else {
                        i++;
                        next(i);
                    }
                });
            }
        } else {
            create();
        }
    }

    function create() {
        Chat.create({
            name: 'test',
            members: membersArr
        }, (err, newChat) => {
            if (err) return callback(err);
            callback(error);
        });
    }
}

exports.getChatList = function(user) {
    Chat.find({})
}

exports.session = class {
    constructor(user, chatId) {
        this.db = mongoose.connect(config.get('userManager.mongodb'), { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });
        this.chat = Chat.findById(chatId);
        this.user = await this.chat.members.findOne({id:user.id});
    }

    send(content) {
        this.chat.messages.push({

        })
    }
}
*/
