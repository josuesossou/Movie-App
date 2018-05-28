import { mongoose } from './mongoose';

//chat room model
const UsersData = mongoose.model('Users_Data', {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        trim: true,
        require: true,
        minlength: 1,
        unique: true,
    },
    joinRoomName: {
        type: String,
        required: false,
        trim: true,
    },
    socketId: {
        type: String,
        required: false,
        trim: true,
    },
    isJoinedRoom: {
        default: false,
        type: Boolean,
        required: true,
        trim: true,
    },
    room_name: {
        type: String,
        required: false,
        trim: true,
    },
    isRoomCreator: {
        type: Boolean,
        required: false,
        trim: true,
    },
    movies: [{
        movie_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            trim: true,
        }
    }],
    movie_room: {
        type: String,
        required: false,
        trim: true,
    },
    status: {
        type: Boolean,
        trim: true,
        required: true,
    }
});

module.exports = { UsersData };
