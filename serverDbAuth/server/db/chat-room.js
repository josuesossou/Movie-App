import { mongoose } from './mongoose';

//chat room model
const ChatRoom = mongoose.model('Chat-room', {
    room_name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    creator_name: {
        type: String,
        required: true,
        trim: true
    },
    members: {
        type: Array,
        required: true,
    },
    room_size: {
        default: 0,
        type: Number,
        required: true
    }
});

module.exports = { ChatRoom };
