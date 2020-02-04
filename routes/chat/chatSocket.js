const io = require('socket.io')();
const chatManager = require('./chat');

io.on('connection', socket => {
    console.log('a user connected');
    if (!socket.request.session.user) return socket.disconnect(true);

    console.log("user is logged in");

    var user = socket.request.session.user;

    var uuid = user.uuid;
    if(user.role == 'admin'){
        uuid = 'admin';
    }

    chatManager.getChatList(uuid, (err, chats) => {
        var list = [];
        var chatSessions = [];

        for (const chat of chats) {
            for (const m of chat.members) {
                if (m.uuid == user.uuid) {
                    member = m;
                }
                if (user.role == m.uuid) {
                    member = m;
                }
            }
            var session = new chatManager.session(chat, member);

            session.listen((doc) => {
                socket.emit('setMessageList', {
                    uuid: doc.uuid,
                    name: session.member.chatName,
                    messages: doc.messages.sort(function (a, b) {
                        return new Date(a.date) - new Date(b.date);
                    })
                });
            });

            chatSessions.push(session);
        }

        socket.on('send', (data) => {
            console.log('sending message to:', data.uuid);

            for (const session of chatSessions) {
                if (session.chat.uuid == data.uuid) {
                    console.log(session);
                    
                    session.send(data.message);
                }
            }
        });

        socket.on('resendMessageList', () => {
            for (const session of chatSessions) {
                socket.emit('setMessageList', {
                    uuid: session.chat.uuid,
                    name: session.member.chatName,
                    messages: session.chat.messages.sort(function (a, b) {
                        return new Date(a.date) - new Date(b.date);
                    })
                });
            }
        });
    });


    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

exports.io = io;