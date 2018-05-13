import { ChatRoom } from '../db/chat-room';

const getChatRoom = (id) => ChatRoom.findOne({ _id: id }).then(room => {
    console.log(room.members);
    return room;
});

module.exports = { getChatRoom };
