import { io } from '../config/server-config';
import { generateGroupMessage, generateSelfMessage } from './utils/generateMessage';
import { updateRoomMember } from './utils/disconnect';

io.set('origins', 'http://localhost:4200:*');

io.on('connection', (socket) => {
    console.log('new user connection');
    /*************************** WORLD CHAT MESSAGE **********************/
    //listening to worldchatMessage
    socket.on('worldChatMessage', (message) => {
        //send a newly received world chat message
        io.emit('newWorldChatMessage', message);
    });

    socket.on('joinRoom', (joinRoomName) => {
        socket.join(joinRoomName);
    });

    socket.on('groupMessage', (message) => {
        if (!message.isLeaveMessage && !message.isConnectedMessage && !message.newMember) {
            socket.emit('newGroupMessage', generateSelfMessage(message));
        }
        
        socket.broadcast.to(message.joinedRoomName)
                        .emit('newGroupMessage', generateGroupMessage(message));
    });

    socket.on('leave', (message) => {
        socket.leave(message.joinRoomName);

        socket.broadcast.to(message.joinedRoomName)
                        .emit('newGroupMessage', generateGroupMessage(message));
    });

    socket.on('invitation', (message) => {
        socket.broadcast.emit('newInvitation', message);
    });

    socket.on('disconnect', () => {
        updateRoomMember(socket.id).then(res => {
            if (!res) return;

            if (res.userStatus) {
                const message = {
                    messageText: `${res.username} has disconnected`,
                    isDisconectMessage: true,
                };

                socket.leave(res.joinRoomName);

                socket.broadcast.to(res.joinRoomName)
                                .emit('newGroupMessage', generateGroupMessage(message));
            }
            return res;
        }).catch(() => {
            console.log('error');
        });
    });
});

module.exports = { io };
