import { io } from '../config/server-config';
import { generateGroupMessage, generateSelfMessage } from './utils/generateMessage';

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

    socket.on('groupMessage', (message) => {
        console.log(message);

        if (!message.isLeaveMessage) {
            socket.emit('newGroupMessage', generateSelfMessage(message));
        }
        socket.broadcast.to(message.joinedRoomName)
                        .emit('newGroupMessage', generateGroupMessage(message));
    });

    // socket.on('joinedGroupMessage', (message) => {
    //     console.log(message);

    //     socket.broadcast.to(message.joinedRoomName)
    //                     .emit('newGroupMessage', generateGroupMessage(message));
    //     socket.emit('newGroupMessage', generateSelfMessage(message));
    // });
});

module.exports = { io };
