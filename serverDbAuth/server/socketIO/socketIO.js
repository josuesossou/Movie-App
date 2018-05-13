import { io } from '../config/server-config';

io.set('origins', 'http://localhost:4200:*');

io.on('connection', (socket) => {
    console.log('new user');

    /*************************** WORLD CHAT MESSAGE **********************/
    //listening to worldchatMessage
    socket.on('worldChatMessage', (message) => {
        //send a newly received world chat message
        io.emit('newWorldChatMessage', message);
    });

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
    });
});

module.exports = { io };
