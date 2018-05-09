import { mongoose } from './mongoose';

//chat room model
const ActiveUsers = mongoose.model('Active_users', {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    user_name: {
        type: String,
        required: true,
        trim: true
    },
    socket_id: {
        type: String,
        required: true,
        trim: true
    },
});

module.exports = { ActiveUsers };
