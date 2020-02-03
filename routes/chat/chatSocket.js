const io = require('socket.io')();
const chatManager = require('./chat');

io.on('connection', socket => {
    console.log('a user connected');
    if(!socket.request.session.user) return socket.disconnect(true);

    console.log("user is logged in");
    
    var user = socket.request.session.user;

    chatManager.getChatList(user.uuid, (err, chats)=>{
        var list = [];
        var chatSessions = [];

        for (const chat of chats) {
            var member;

            list.push({
                uuid: chat.uuid,
                name: chat.name
            });

            for (const m of chat.members) {
                if(m.uuid == user.uuid){
                    member = m;
                }
            }

            var session = new chatManager.session(chat, member);

            session.listen((doc)=>{
                socket.emit('setMessageList', {
                    uuid: doc.uuid,
                    messages: doc.messages.sort(function(a, b) {
                        return new Date(a.date) - new Date(b.date);
                    })
                })
            });

            chatSessions.push(session);
        }

        socket.on('send', (data) => {
            console.log('sending message to:', data.uuid);
            
            for (const session of chatSessions) {                
                if(session.chat.uuid == data.uuid){
                    session.send(data.message);
                }
            }
        });
        

        socket.emit('setChatList', list);
    }); 
    

    socket.on('disconnect', () => {
        console.log('a user disconnected'); 
    });
});

exports.io = io;