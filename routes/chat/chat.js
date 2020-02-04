"use strict";

const config = require('config');
const events = require('events');
const chatEvents = new events.EventEmitter();
const mongoose = require('mongoose');
const userManager = require('../user/userManager');
const uuidv4 = require('uuid/v4');



// connect to database
mongoose.connect(config.get('mongodb'), { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });



var memberSchema = new mongoose.Schema({
    uuid: { type: String, required: [true, 'id missing'] },
    name: { type: String, required: [true, 'name missing'] },
    chatName: { type: String, required: [true, 'chatName missing'] }
});

var messageSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    sender: memberSchema,
    type: { type: String, default: 'text', required: [true, 'type missing'] },
    content: { type: String, required: [true, 'content missing'] }
});

var chatSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4, required: [true, 'uuid missing']},
    name: { type: String, required: [true, 'name missing'] },
    members: [memberSchema],
    messages: [messageSchema]
});

var Chat = mongoose.model('Chat', chatSchema);


Chat.watch().on('change', data => {
    Chat.findById(data.documentKey, (err, doc)=>{
        console.log(doc);
        
        chatEvents.emit(doc.uuid, doc);
    });    
});



exports.listen = function(uuid, listener) {
    chatEvents.on(uuid, listener);
}

exports.create = function (name, membersArr, callback) {
    var error;

    if (membersArr.length < 2) {
        callback(new Error("To create a chat you need at least 2 members"));
    } else {
        next(0);
    }

    function next(i) {
        if (i < membersArr.length) {
            console.log(membersArr[i].uuid);

            if (membersArr[i].uuid == "admin") {
                i++;
                next(i);
            } else {
                userManager.isUser(membersArr[i].uuid, (result) => {
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

exports.getChatList = function(uuid, callback) {
    var error;

    Chat.find({'members.uuid': uuid}, (err, docs) => {
        if (err) {
            callback(err);
        }
        if (docs.length) {
            callback(error, docs);
        } else {
            callback(new Error('user does not particapate in any chat.'))
        }
    });
}

exports.session = class {
    constructor(chat, member) {
        this.chat = chat;
        this.member = member;
    }

    send(content) {
        var member = this.member
        this.chat.messages.push({
            sender: member,
            content: content
        });
        this.chat.save();
    }

    listen(listener) {
        chatEvents.on(this.chat.uuid, listener);
        console.log(chatEvents);
        
    }
}
