import { ChatRoom } from '../db/chat-room';

const getChatRoom = (id) => ChatRoom.findOne({ _id: id }).then(room => room);

const updateChatRoom = (id, room) => ChatRoom.findOneAndUpdate(
    { _id: id },
    { $set: room },
    { new: true }).then((newRoom) => newRoom)
                    .catch(err => err);

module.exports = { getChatRoom, updateChatRoom };
