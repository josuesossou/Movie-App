import { ObjectId } from 'mongodb';
import { UsersData } from '../../db/users_data';
import { getChatRoom, updateChatRoom } from '../../lib/chat-room';
import { User } from '../../db/users';

const updateRoomMember = async (socketId) => {
    const userData = await UsersData.findOneAndUpdate({ socketId },
                                    { $set: { socketId: '' } },
                                    { new: true });

    if (!userData || userData === '') return;

    let userStatus = true;

    const user = await User.findById({ _id: userData.user_id });

    if (!user || user === '') return;

    const room = await getChatRoom(userData.joinRoomName);

    if (!room || room === '') return;

    const userId = ObjectId(userData.user_id).toString();

    if (!userId || userId === '') return;

    room.members = room.members.map(member => {
        if (member.memberId === userId) {
            const updatedMember = member;
            if (member.status === false) {
                userStatus = false;
            }
            updatedMember.status = false;
            return updatedMember;
        }

        return member;
    });

    return updateChatRoom(userData.joinRoomName, room).then(doc => {
        if (!doc) return 'unable to update chatroom';

        return { 
            joinRoomName: userData.joinRoomName,
            userStatus,
            username: user.username
        };
    }).catch(e => e);
};

module.exports = { updateRoomMember };
