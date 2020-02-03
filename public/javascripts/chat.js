var socket = io.connect('http://localhost:3000');

socket.on('setChatList', (data)=>{
    console.log(data);
    
});

socket.on('setMessageList', (data)=>{console.log(data);});

