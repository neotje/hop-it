var socket = io.connect('http://' + window.location.hostname + ':8080');

var chats = {};

socket.on('setMessageList', (data)=>{
    chats[data.uuid] = {
        last: data.messages[data.messages.length - 1],
        name: data.name,
        messages: data.messages
    };    
});

export function getIO() {
    return socket;
}

export function getChat(uuid) {    
    if (chats[uuid]) {
        return chats[uuid];
    } else {
        return false;
    }
}

export function send(uuid, content){
    socket.emit('send', {
        uuid: uuid,
        message: content
    });
}

export function onRecieveMessage(uuid, listener) {
    socket.on('setMessageList', (data)=>{
        if (data.uuid == uuid) {            
            listener({
                last: data.messages[data.messages.length - 1],
                uuid: data.uuid,
                name: data.name,
                messages: data.messages
            });
        }
    });
}


