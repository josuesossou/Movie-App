const generateGroupMessage = (message) => {
    const groupMessage = message;
    groupMessage.class = 'group-message';
    groupMessage.isToGroup = true;

    switch (true) {
        case message.isJoinMessage:
        groupMessage.messageText = `${message.senderName} entered the room`;
        break;

        case message.isLeaveMessage:
        groupMessage.messageText = `${message.senderName} left the room`;
        break;

        case message.isLeave:
        groupMessage.messageText = `${message.senderName} has left the room permenantly`;
        groupMessage.classTwo = 'red-border';
        break;

        case message.isConnectedMessage:
        groupMessage.messageText = `${message.senderName} has reconnected`;
        break;

        case message.newMember:
        groupMessage.messageText = `${message.senderName} has joined the room!`;
        groupMessage.senderName = 'New Member';
        groupMessage.classTwo = 'green-border';
        break;

        default:
    }

    return groupMessage;
};

const generateSelfMessage = (message) => {
    const selfMessage = message;
    selfMessage.class = 'self-message';
    selfMessage.isToGroup = false;

    if (message.isJoinMessage) {
        selfMessage.messageText = `Welcome to ${message.roomName}`;
    }

    return selfMessage;
};

module.exports = { generateGroupMessage, generateSelfMessage };
