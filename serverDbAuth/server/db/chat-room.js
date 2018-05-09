import { mongoose } from './mongoose';

//chat room model
const ChatRoom = mongoose.model('Chat-room', {
    room_name: {
        type: String,
        required: true,
        trim: true
    },
    creator_name: {
        type: String,
        required: true,
        trim: true
    },
    _creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    room_size: {
        type: Number,
        required: true
    }
});

module.exports = { ChatRoom };
